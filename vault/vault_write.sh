#!/bin/bash -l

# update vault key through jenkins jobs

set -x # log all commands as they are run

sudo yum install -y epel-release

sudo yum install -y jq

export DOCKER_HOST=unix:///var/run/docker.sock
export VAULT_ADDR='<vault_address_here>'
github_token='<git_token_here>'

echo "ENVIRONMENT: ${ENVIRONMENT}"
echo "TEAM: ${TEAM}"
echo "ENV_VARIABLES: ${ENV_VARIABLES}"


# Write to vault
# vault write secret/<githubteamname>/test value=test123
echo ">>>> Start write to vault with config: ${ENV_VARIABLES}"

VARS=$(echo ${ENV_VARIABLES} | tr ";" "\n")
ENVS=""

PATH=secret/${TEAM}/${ENVIRONMENT}
/usr/bin/vault auth -method=github token=$github_token
/usr/bin/vault read -format=json ${PATH}
SECRET_KEYS=$(/usr/bin/vault read -format=json ${PATH})

# Ensure unknown host key exception doesn't happen when pulling from maven git repo

if [ "$SECRET_KEYS" = "null" ]; then
  echo ">>>> No key available for ${ENVIRONMENT}"
  for data in $VARS
    do
      ENVS+="${data} "
  done
  /usr/bin/vault write ${PATH} ${ENVS}
else
  JSON_FIELD=$(/usr/bin/vault read --format=json ${PATH} | /usr/bin/jq ".data" )
  if [ "$JSON_FIELD" = "null" ]; then
    echo ">>> No JSON_FIELD"
  else
    echo ">>>>> JSON FIELD"
    echo $JSON_FIELD | sed 's/^"//' | sed 's/"$//'
    for data in $VARS
      do
        IFS='=' read -r -a arrIN <<< ${data}
        key=${arrIN[0]}
        value=${arrIN[1]}
        echo ">>> Inject key=${key}, value=${value}"
        /usr/bin/vault read -format=json ${PATH} | /usr/bin/jq '.data' | \
          /usr/bin/jq --arg k ${key} --arg v "${value}" '.[$k] = $v' | \
          /usr/bin/vault write ${PATH} -
    done
  fi
fi


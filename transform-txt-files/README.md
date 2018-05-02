Script transform .txt file into new format

Original file
```
us
123
456
567
fr
12341
123
1231
```

New file
```
<entry key="us">
  <list>
    <value>123</value>
    <value>456</value>
    <value>567</value>
  </list>
</entry>
<entry key="fr">
  <list>
    <value>12341</value>
    <value>123</value>
    <value>1231</value>
  </list>
</entry>
```

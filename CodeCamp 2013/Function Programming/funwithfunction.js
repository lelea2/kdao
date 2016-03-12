//ADD AND MUL function
function add(x, y) {
    return x +y;
}

function mul(x, y) {
    return x * y;
}
//add(3, 4);
//mul(3, 4);
/** function that takes argument and returns a function that return that value */
function indentityf(x) {
    return function () {
        return x;
    };
};
//var idf3 = indentityf(3);
//idf3();
/** function that adds from two invocations **/
function addf(x) {
    return function(y) {
        return x + y;
    }
}
//addf(3)(4);
//Function that takes function binary and var and return reuslt of function binary
function applyf(binary) {
    return function(x) {
        return function(y) {
            return binary(x, y);
        }
    }
};
var addf = applyf(add);
//addf(3)(4);
//applyf(mul)(5)(6);
///Wite function taht takes function and argument and returns a function that suppy a second argument
function curry(binary, first) {
    return function(second) {
        return binary(first, second);
    }
}
var add3 = curry(add, 3);
//add3(4);
//curry(mul, 5)(6);
//Using those above function to get the result
var inc = curry(add, 1);
//inc(5);
//inc(inc(5));
//inc = addf(1);
//inc = applyf(add)(1);
//////////////////
function twice(binary) {
    return function(y) {
        return binary(y, y);
    }
}
var doubl = twice(add);
//doubl(11);
var square = twice(mul);
//twice(mul)(11)
/////
function sub(first, second) {
    return first - second;
}
function switcheroo(binary) {
    return function (x, y) {
        return binary(y, x);
    }
}
//switcheroo(sub)(3, 2);
function composeu(func1, func2) {
    return function(x) {
        return (func2(func1(x)));
    }
}
//doubl(3);
//square(3);
//composeu(doubl, square)(3);
function composeub(func1, func2) {
    return function(x, y, z) {
        return (func2(func1(x,y), z));
    }
}
composeub(add, mul)(2, 3, 5);


////Write a function taht allows a binary function to be called only once (counter concept)
function once(func) {
    var err = false;
    return function(x, y) {
        if(!err) {
            err = true;
            return func(x,y);
        }
        return "error";
    }
}
//var add_once = once(add);
//add_once(3, 4);
//add_once(3, 5);
//Factory function that return 2 function taht implement up/down counter, hinding the counter
function counterf(x) {
    return {
        inc: function() {
            return x + 1;
        }, 
        dec: function() {
            return x - 1;
        }
    }
}
var counter = counterf(10);
var inc = counter.inc;
    dec = counter.dec;
//inc();
//dec();

//Revocable function that takes functunction and returns an object containing an invoke function that can incoke function, and revoke
//function disables the invoke function
function log(x) {
    return console.log(x);
}
function revocable(nice) {
     return {
          invoke: function(x) {
               return (nice ? nice(x) : "error");
          },
          revoke: function() {
              nice = null;
          }
     }
}
var temp = revocable(log);
invoke = temp.invoke;
//invoke(7);
//temp.revoke()
//invoke(8);
//Gensymf that make function that generate unique symbols
function gensymf(x) {
    var counter = 0;
    return function() {
         counter += 1;
         return (x + counter);
    }
}
var gensym = gensymf("G");
gensym();
gensym();
gensym();
gensym();
//Wite Finbonacciscunftion
function finbonnanccif (x, y) {
     var counter = 0,
         prev = x, curr = y;
     return function (){
          if (counter === 0) {
              counter += 1;
              return x;
          } else if (counter === 1) {
              counter += 1;
              return y;
          } else {
              counter += 1;
              value = prev + curr;
              prev = curr;
              curr = value;
          }
          return value;
     }
}
var fib = finbonnanccif(0,1);
fib();
fib();
fib();
fib();
fib();
fib();
var Common;

Common = (function() {
  function Common() {}

  Common.prototype.toJson = function(str) {
    var err, error;
    try {
      return JSON.parse(str);
    } catch (error) {
      err = error;
      return {};
    }
  };

  return Common;

})();

var Page1;

Page1 = (function() {
  function Page1() {}

  Page1.prototype.build = function() {
    return 'page1';
  };

  Page1.prototype.results = function() {
    return {
      name: 'pageeee'
    };
  };

  return Page1;

})();

var Page2;

Page2 = (function() {
  function Page2() {}

  Page2.prototype.build = function() {
    return 'page2';
  };

  return Page2;

})();

window.onload = function () {
    new Page1().build();
    new Page2().build();
    new Common().toJson('aaa');
};
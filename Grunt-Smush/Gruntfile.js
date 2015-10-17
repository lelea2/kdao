
'use strict';

module.exports = function(grunt) {

grunt.initConfig({
  smushit: {
    mygroup: {
      src: ['sprite.png'],
      dest: 'test'
    }
  }
});

grunt.loadNpmTasks('grunt-smushit');

//grunt.registerTask('test', []);
grunt.registerTask('default', ['smushit']);
};

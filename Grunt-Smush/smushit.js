
grunt.initConfig({
  smushit: {
    mygroup: {
      src: ['../sprite-set[1].png'],
      dest: 'test'
    }
  }
});

grunt.loadNpmTasks('grunt-smushit');

grunt.registerTask('test', []);

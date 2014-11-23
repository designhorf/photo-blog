module.exports = function (grunt) {
    var isProd = (grunt.option('production') !== undefined) ? Boolean(grunt.option('production')) : process.env.GRUNT_ISPROD === '1'
    var staticTargetDir = './assets/';

    if (!isProd) {
        grunt.log.subhead('Running Grunt in DEV mode');
    }

    grunt.initConfig({
        sass: {
            compile: {
                files: [
                    {
                        expand: true,
                        cwd: 'stylesheets',
                        src: ['*.scss', '!_*'],
                        dest: staticTargetDir + 'stylesheets/',
                        rename: function (dest, src) {
                            return dest + src.replace('scss', 'css');
                        }
                    }
                ],
                options: {
                    style: 'uncompressed',
                    noCache: true,
                    quiet: false,
                    loadPath: []
                }
            }
        },
        watch: {
            css: {
                files: ['stylesheets/**/*.scss', 'stylesheets/**/*.css'],
                tasks: ['compile:css', 'hash'],
                options: {
                    spawn: false
                }
            }
        },
        clean: {
            css: [staticTargetDir + 'stylesheets' ],
            hash: [staticTargetDir + 'assets.map', staticTargetDir + 'stylesheets'],
            hooks: ['.git/hooks/pre-commit']
        },
        copy: {
            css: {
                files: [
                    {
                        expand: true,
                        cwd: 'css',
                        src: ['**/*.scss', '**/*.css'],
                        dest: staticTargetDir + 'compiled/stylesheets'
                    }
                ]
            }
        },
        cssmin: {
            minify: {
                expand: true,
                src: [staticTargetDir + 'stylesheets/**/*.css'],
                ext: '.min.css'
            }
        },
        hash: {
            options: {
                // assets.map must go where Play can find it from resources at runtime.
                // Everything else goes into frontend-static bundling.
                mapping: staticTargetDir + 'assets.map',
                srcBasePath: staticTargetDir,
                destBasePath: staticTargetDir,
                flatten: false,
                hashLength: (isProd) ? 32 : 0
            },
            files: {
                expand: true,
                cwd: staticTargetDir,
                src: '**/*',
                filter: 'isFile',
                dest: staticTargetDir,
                rename: function (dest, src) {
                    // remove .. when hash length is 0
                    return dest + src.split('/').slice(0, -1).join('/');
                }
            }
        }
    })

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-shell');
    // grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-asset-monitor');
    // grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-hash');

    grunt.registerTask('default', ['compile']);

    grunt.registerTask('validate', function (app) {
        if (!app) {
            grunt.task.run('jshint');
        } else {
            // jsihnt target exist?
            if (grunt.config('jshint')[app]) {
                grunt.task.run('jshint:' + app);
            }
        }
    });

    // Compile tasks
    grunt.registerTask('compile:css', ['clean:css', 'sass:compile'
     , 'copy:css'
        , 'cssmin'
//      , 'concat_css'
//      , 'clean:compiled'
//      , 'clean:hash'
        , 'sass'
        , 'hash'
    ]);
    grunt.registerTask('compile', function (app) {
        grunt.task.run([
            'compile:css'
        ]);
    });
    grunt.registerTask('hookmeup', ['clean:hooks', 'shell:copyHooks']);

    grunt.registerTask('deploy', ['hash', 'cache']);
}

pipeline {
    agent any

    stages {

        stage('Install Dependencies (Node 10)') {
            tools {
                nodejs 'Node10'
            }
            steps {
                dir('Front-End') {
                    sh 'node -v'
                    sh 'npm -v'
                    sh 'npm install'
                }
            }
        }

        stage('Build Legacy (Node 10)') {
            tools {
                nodejs 'Node10'
            }
            steps {
                dir('Front-End') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Modern Feature (Node 18)') {
            tools {
                nodejs 'Node18'
            }
            steps {
                dir('Front-End') {
                    sh 'node -v'
                    sh 'npm -v'
                    sh 'npm run build:new-feature'
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline finalizado correctamente'
        }
        failure {
            echo '❌ Pipeline falló'
        }
    }
}

pipeline {
    agent any

    stages {

        stage('Install Dependencies (Node 10)') {
            tools {
                nodejs 'node10'
            }
            steps {
                dir('Front-End') {
                    sh 'node -v'
                    sh 'npm install'
                }
            }
        }

        stage('Build Legacy (Node 10)') {
            tools {
                nodejs 'node10'
            }
            steps {
                dir('Front-End') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Modern Feature (Node 18)') {
            tools {
                nodejs 'node18'
            }
            steps {
                dir('Front-End') {
                    sh 'node -v'
                    sh 'npm run build:new-feature'
                }
            }
        }
    }
}

pipeline {
    agent any

    tools {
        maven 'Default Maven'
        jdk 'Default JDK'
        nodejs 'node10'  // por defecto usamos Node 10
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Legacy (Node 10)') {
            steps {
                dir('Front-End-Legacy') {
                    sh '''
                        echo "Usando Node $(node -v)"
                        npm ci
                        npm run build:legacy
                    '''
                }
            }
        }

        stage('Build Modern / SonarQube (Node 18)') {
            tools {
                nodejs 'node18'
            }
            steps {
                dir('Front-End-Modern') {
                    sh '''
                        echo "Usando Node $(node -v)"
                        npm ci
                        npm run build
                    '''
                }

                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('sonarqube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
    }

    post {
        success { echo "✅ Pipeline completado correctamente" }
        failure { echo "❌ Hubo errores en el pipeline" }
    }
}

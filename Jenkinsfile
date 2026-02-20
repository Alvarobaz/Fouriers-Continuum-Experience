pipeline {
    agent any
    environment {
        // Ajusta la ruta de Node si es necesario en tu Jenkins
        NODEJS_HOME = '/usr/local/bin/node'
        PATH = "${env.NODEJS_HOME}:${env.PATH}"
    }
    stages {
        stage('Checkout SCM') {
            steps {
                echo 'Obteniendo código desde Git...'
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                echo 'Compilando Backend...'
                dir('Back-End') {
                    sh 'chmod +x mvnw'
                    sh './mvnw clean compile'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Compilando Frontend Angular...'
                dir('Front-End') {
                    // Instalación ignorando conflictos de peer dependencies
                    sh 'npm install --legacy-peer-deps'
                    
                    // Compilar Angular
                    sh 'npm run build'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completado ✅'
        }
        failure {
            echo 'Pipeline falló ❌'
        }
    }
}

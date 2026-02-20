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
                    // Limpia cualquier carpeta con permisos incorrectos
                    sh 'rm -rf node_modules'
                    
                    // Asegura permisos completos para el usuario actual
                    sh 'chmod -R 777 .'
                    
                    // Instala dependencias ignorando conflictos de peer deps
                    sh 'npm install --legacy-peer-deps'
                    
                    // Construye Angular
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

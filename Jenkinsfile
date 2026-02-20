pipeline {
    agent any
    environment {
        // Ajusta según la instalación de Node en tu Jenkins
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
                    // Limpiar node_modules y lock file solo si quieres regenerarlo en CI
                    // sh 'rm -rf node_modules package-lock.json'
                    
                    // Instalación segura de dependencias
                    sh 'npm install'
                    
                    // Construir Angular
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

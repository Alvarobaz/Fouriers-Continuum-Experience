pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        BACKEND_DIR = 'Back-End'
        FRONTEND_DIR = 'Front-End'
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
                dir("${BACKEND_DIR}") {
                    sh 'chmod +x mvnw'
                    sh './mvnw clean compile'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Compilando Frontend Angular...'
                dir("${FRONTEND_DIR}") {

                    // limpia dependencias corruptas
                    sh 'rm -rf node_modules package-lock.json || true'

                    // instala dependencias
                    sh 'npm install'

                    // build angular
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Análisis SonarQube (pendiente configuración)'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completado correctamente ✅'
        }
        failure {
            echo 'Pipeline falló ❌'
        }
    }
}

pipeline {
    agent any

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
                    sh 'npm ci'  // Instala dependencias
                    sh 'ng build --source-map=false'
                }
            }
        }
    }

    post {
        success { echo 'Pipeline finalizado ✅' }
        failure { echo 'Pipeline falló ❌' }
    }
}

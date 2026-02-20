pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
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
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Ejecutando análisis SonarQube...'
                withSonarQubeEnv('SonarQube') {
                    dir('Back-End') {
                        sh './mvnw sonar:sonar'
                    }
                }
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

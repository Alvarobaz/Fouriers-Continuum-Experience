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
                echo 'Compilando proyecto Java...'
                sh './mvnw clean compile'
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Compilando frontend...'
                dir('frontend') {
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
                    sh '''
                        ./mvnw sonar:sonar
                    '''
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

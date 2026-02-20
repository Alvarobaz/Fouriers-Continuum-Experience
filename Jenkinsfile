pipeline {
    agent any

    tools {
        maven 'Maven'
        jdk 'JDK21'
        nodejs 'NodeJS'   // Debe estar configurado en Jenkins
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Clonando repositorio...'
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                echo 'Compilando Backend...'
                dir('backend') {
                    sh 'mvn clean compile'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Compilando Frontend...'
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
                echo 'Analizando código con SonarQube...'
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.sources=. \
                        -Dsonar.java.binaries=backend/target/classes
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

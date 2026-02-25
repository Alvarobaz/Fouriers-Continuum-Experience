pipeline {
    agent any

    tools {
        maven 'Maven 3.8.8'
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
            }
        }

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'  // nombre EXACTO de la tool
                    withSonarQubeEnv('sonarqube') {        // nombre EXACTO del server
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('Prueba de Pipeline') {
            steps {
                echo "Pipeline funcionando correctamente"
            }
        }
    }

    post {
        always {
            echo "Pipeline finalizado"
        }
    }
}

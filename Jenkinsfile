pipeline {
    agent any

    tools {
        maven 'Maven 3.8.8'
        sonarScanner 'SonarScanner' // <-- nombre de la herramienta instalada en Jenkins
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
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('sonarqube') {  // <-- nombre exacto de tu servidor SonarQube
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('Prueba de Pipeline') {
            steps {
                echo "🔹 Pipeline base funcionando correctamente"
            }
        }
    }

    post {
        always {
            echo "✅ Pipeline ejecutado correctamente"
        }
    }
}

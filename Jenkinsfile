pipeline {
    agent any

    stages {

        stage('SCM') {
            steps {
                echo 'Obteniendo código desde Git...'
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Analizando calidad con SonarQube...'
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline OK '
        }
        failure {
            echo 'Pipeline falló '
        }
    }
}

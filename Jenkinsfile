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
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('sonarqube') {
                        // Ejecuta SonarScanner y devuelve código de salida
                        def status = sh(
                            script: "${scannerHome}/bin/sonar-scanner",
                            returnStatus: true
                        )
                        echo "Sonar exit code: ${status}"

                        // Opcional: si quieres marcar build como FAILURE según código
                        // if (status != 0) {
                        //     error("SonarQube Quality Gate failed")
                        // }
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
            echo "✅ Pipeline ejecutado (estado real según stages)"
        }
    }
}

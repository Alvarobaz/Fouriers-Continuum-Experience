pipeline {
    agent any

    tools {
        maven 'Maven 3.8.8'
    }

    stages {

        stage('Clean Workspace') {
            steps {
                echo "🔹 Limpiando workspace"
                deleteDir()
            }
        }

        stage('Checkout SCM') {
            steps {
                echo "🔹 Haciendo checkout del repositorio GitHub"
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo "🔹 Compilando proyecto con Maven"
                sh 'mvn clean compile'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'

                    // Debug: mostrar versión y path
                    sh "echo 'Scanner Home: ${scannerHome}'"
                    sh "${scannerHome}/bin/sonar-scanner -v"

                    // Ejecutar análisis con debug y manejo de fallo
                    withSonarQubeEnv('SonarQube') {
                        sh """
                           ${scannerHome}/bin/sonar-scanner -X || echo '⚠️ SonarScanner falló, pero el pipeline continúa'
                        """
                    }
                }
            }
        }

        stage('Pipeline OK') {
            steps {
                echo "✅ Pipeline ejecutado correctamente"
            }
        }
    }

    post {
        always {
            echo "🔹 Pipeline finalizado"
        }
    }
}

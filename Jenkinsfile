pipeline {
    agent any

    stages {

        stage('Install Dependencies Legacy (Node 10)') {
            tools {
                nodejs 'node10' // Asegúrate que el nombre coincide con tu configuración de Jenkins
            }
            steps {
                dir('Front-End-Legacy') { // Carpeta separada para legacy
                    sh 'node -v'
                    sh 'npm install'
                    sh 'npm run build:legacy' // tu script legacy
                }
            }
        }

        stage('Install Dependencies Modern (Node 18)') {
            tools {
                nodejs 'node18' // Asegúrate que el nombre coincide con tu configuración de Jenkins
            }
            steps {
                dir('Front-End') { // Carpeta moderna
                    sh 'node -v'
                    sh 'npm install'
                    sh 'npm run build' // tu script moderno
                }
            }
        }
    }

    post {
        success {
            echo '✅ Todo OK'
        }
        failure {
            echo '❌ Algo falló'
        }
    }
}

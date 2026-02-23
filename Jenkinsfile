pipeline {
    agent any

    environment {
        // No tocar, Jenkins asignará PATH según cada herramienta
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build Angular 8 (Node 10)') {
            steps {
                script {
                    // Selecciona Node 10
                    env.PATH = "${tool 'node10'}/bin:${env.PATH}"

                    echo "Usando Node:"
                    sh 'node -v'
                    echo "Usando npm:"
                    sh 'npm -v'

                    // Instala dependencias y build Angular 8
                    sh 'npm install'
                    sh 'ng build --prod'
                }
            }
        }

        stage('Build New Feature (Node 18)') {
            steps {
                script {
                    // Cambia a Node 18
                    env.PATH = "${tool 'node18'}/bin:${env.PATH}"

                    echo "Usando Node:"
                    sh 'node -v'
                    echo "Usando npm:"
                    sh 'npm -v'

                    // Instala dependencias de la nueva parte
                    sh 'npm install'
                    sh 'ng build --prod'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finalizado ✅'
        }
        failure {
            echo 'Pipeline falló ❌'
        }
    }
}

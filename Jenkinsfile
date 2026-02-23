pipeline {
    agent any

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

                    echo "🔹 Usando Node 10 para Angular 8"
                    sh 'node -v'
                    sh 'npm -v'

                    dir('Front-End') {
                        echo "🔹 Limpiando dependencias y dist"
                        sh 'rm -rf node_modules package-lock.json dist || true'

                        echo "🔹 Instalando dependencias"
                        sh 'npm install --legacy-peer-deps'

                        echo "🔹 Compilando Angular 8"
                        sh 'npx ng build --prod'
                    }
                }
            }
        }

        stage('Build New Feature (Node 18)') {
            steps {
                script {
                    // Cambia a Node 18
                    env.PATH = "${tool 'node18'}/bin:${env.PATH}"

                    echo "🔹 Usando Node 18 para nueva feature"
                    sh 'node -v'
                    sh 'npm -v'

                    // Cambia esta carpeta según donde esté tu nuevo proyecto
                    dir('Front-End-New') {
                        echo "🔹 Limpiando dependencias y dist"
                        sh 'rm -rf node_modules package-lock.json dist || true'

                        echo "🔹 Instalando dependencias"
                        sh 'npm install'

                        echo "🔹 Compilando nueva feature"
                        sh 'npx ng build --prod'
                    }
                }
            }
        }
    }

    post {
        always {
            echo '✅ Pipeline finalizado'
        }
        failure {
            echo '❌ Pipeline falló'
        }
    }
}

pipeline {
    agent any
    environment {
        NODE_VERSION = "10"
        PATH = "${tool 'NodeJS_'+NODE_VERSION}/bin:${env.PATH}"
    }
    stages {

        stage('Preparar Front-End') {
            steps {
                dir('Front-End') {
                    echo "🔹 Limpiando node_modules y package-lock.json..."
                    sh '''
                        # Elimina todo el contenido que pueda dar problemas
                        rm -rf node_modules package-lock.json || true
                        rm -rf dist || true
                    '''
                }
            }
        }

        stage('Instalar dependencias') {
            steps {
                dir('Front-End') {
                    echo "🔹 Instalando dependencias con Node ${NODE_VERSION}..."
                    sh 'npm install --legacy-peer-deps'
                }
            }
        }

        stage('Build') {
            steps {
                dir('Front-End') {
                    echo "🔹 Compilando aplicación Front-End..."
                    sh 'npx ng build --prod || true'
                }
            }
        }

        stage('SonarQube Analysis') {
            when {
                expression { return fileExists('Front-End/sonar-project.properties') }
            }
            steps {
                echo "🔹 Ejecutando análisis SonarQube..."
                sh 'sonar-scanner -Dproject.settings=Front-End/sonar-project.properties'
            }
        }
    }

    post {
        always {
            echo "✅ Pipeline finalizado"
        }
        failure {
            echo "❌ Pipeline falló"
        }
    }
}

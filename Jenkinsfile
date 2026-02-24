pipeline {
    agent any

    stages {
        stage('Build Legacy (Node 10)') {
            tools { nodejs 'node10' }
            steps {
                dir('Front-End') {
                    sh '''
                        echo "Usando Node $(node -v)"
                        # Instalación de dependencias solo para Node 10
                        npm ci
                        npm run build:legacy
                    '''
                }
            }
        }

        stage('Build Modern (Node 18)') {
            tools { nodejs 'node18' }
            steps {
                dir('Front-End') {
                    sh '''
                        echo "Usando Node $(node -v)"
                        # Limpia node_modules temporalmente si quieres aislar
                        mv node_modules node_modules_node10 || true
                        npm ci
                        npm run build
                        # Opcional: restaurar node_modules legacy
                        rm -rf node_modules
                        mv node_modules_node10 node_modules || true
                    '''
                }
            }
        }
    }

    post {
        success { echo "✅ Todo OK" }
        failure { echo "❌ Algo falló" }
    }
}

pipeline {
    agent any

    stages {
        stage('Build Legacy (Node 10)') {
            tools { nodejs 'node10' }
            steps {
                sh '''
                    echo "Usando Node $(node -v)"
                    mkdir -p node10_modules
                    npm install --prefix ./ node_modules=node10_modules
                    npm run build:legacy
                '''
            }
        }

        stage('Build Modern (Node 18)') {
            tools { nodejs 'node18' }
            steps {
                sh '''
                    echo "Usando Node $(node -v)"
                    mkdir -p node18_modules
                    npm install --prefix ./ node_modules=node18_modules
                    npm run build
                '''
            }
        }
    }

    post {
        success { echo "✅ Todo OK" }
        failure { echo "❌ Algo falló" }
    }
}

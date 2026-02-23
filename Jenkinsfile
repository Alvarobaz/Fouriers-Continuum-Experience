pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {

        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Clean Workspace') {
            steps {
                dir('Front-End') { // Entramos en la carpeta correcta
                    sh '''
                    [ -d node_modules ] && rm -rf node_modules
                    [ -f package-lock.json ] && rm -f package-lock.json
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('Front-End') { // Ahora npm busca package.json en Front-End
                    echo "Instalando dependencias..."
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                dir('Front-End') {
                    echo "Construyendo la aplicación..."
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            when {
                expression { currentBuild.resultIsBetterOrEqualTo('SUCCESS') }
            }
            steps {
                dir('Front-End') {
                    echo "Ejecutando análisis de SonarQube..."
                    sh 'sonar-scanner'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline finalizado correctamente ✅'
        }
        failure {
            echo 'Pipeline falló ❌'
        }
    }
}

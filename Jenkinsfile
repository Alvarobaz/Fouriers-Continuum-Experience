pipeline {
    agent any

    tools {
        maven 'Maven 3.8.8'
        nodejs 'node16'
    }

    stages {

        stage('Clean Workspace') {
            steps { deleteDir() }
        }

        stage('Checkout SCM') {
            steps { checkout scm }
        }

        stage('Build Frontend') {
            steps {
                dir('Front-End') {
                    sh 'npm ci --legacy-peer-deps'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('Back-End') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Package Frontend') {
            steps {
                dir('Front-End') {
                    sh '''
                        npx bestzip frontend.zip dist
                        echo "Contenido Front-End:"
                        ls -l
                    '''
                }
            }
        }

        stage('Publish to Nexus') {
            steps {
                script {
                    def version = "1.0.${env.BUILD_NUMBER}"

                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-cred',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {

                        sh """
                        set -e
                        echo "Subiendo BACKEND..."
                        curl -f -v -u $NEXUS_USER:$NEXUS_PASS \
                        --upload-file Back-End/target/*.jar \
                        http://nexus:8081/repository/maven-releases/backend-${version}.jar

                        echo "Subiendo FRONTEND..."
                        curl -f -v -u $NEXUS_USER:$NEXUS_PASS \
                        --upload-file Front-End/frontend.zip \
                        http://nexus:8081/repository/maven-releases/frontend-${version}.zip

                        echo "✔ Artefactos subidos correctamente"
                        """
                    }
                }
            }
        }
    }

    post {
        success { echo "✅ Pipeline completada correctamente" }
        failure { echo "❌ Algo falló en la pipeline" }
    }
}

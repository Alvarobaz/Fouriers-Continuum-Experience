pipeline {
    agent any

    tools {
        maven 'Maven 3.8.8'
        nodejs 'node16'
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

        stage('Build Frontend') {
            steps {
                dir('Front-End') {
                    sh 'node -v'
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

        stage('Publish to Nexus') {
            when {
                branch 'main'
            }
            steps {
                script {

                    def version = "1.0.${env.BUILD_NUMBER}"

                    withCredentials([usernamePassword(
                        credentialsId: 'nexus-cred',
                        usernameVariable: 'NEXUS_USER',
                        passwordVariable: 'NEXUS_PASS'
                    )]) {

                        // =====================
                        // BACKEND (MAVEN DEPLOY)
                        // =====================
                        dir('Back-End') {
                            sh """
                            mvn deploy:deploy-file \
                              -DrepositoryId=nexus \
                              -Durl=http://nexus:8081/repository/maven-releases/ \
                              -Dfile=target/*.jar \
                              -DgroupId=com.mycompany.issuetracking \
                              -DartifactId=issuetracking \
                              -Dversion=${version} \
                              -Dpackaging=jar \
                              -DgeneratePom=true \
                              -Dusername=$NEXUS_USER \
                              -Dpassword=$NEXUS_PASS
                            """
                        }

                        // =====================
                        // FRONTEND (ZIP + UPLOAD)
                        // =====================
                        dir('Front-End') {

                            sh "zip -r frontend-${version}.zip dist"

                            sh '''
                            curl -f -v -u $NEXUS_USER:$NEXUS_PASS \
                              --upload-file frontend-''' + version + '''.zip \
                              http://nexus:8081/repository/maven-releases/frontend-''' + version + '''.zip
                            '''
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completada correctamente"
        }
        failure {
            echo "❌ Algo falló en la pipeline"
        }
    }
}

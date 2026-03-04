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
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'nexus-cred',
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {

                    dir('Back-End') {
                        sh '''
                        echo "Subiendo BACKEND a Nexus..."

                        mvn deploy:deploy-file \
                          -DrepositoryId=nexus \
                          -Durl=http://nexus:8081/repository/maven-releases/ \
                          -Dfile=target/issuetracking-0.0.1-SNAPSHOT.jar \
                          -DgroupId=com.mycompany.issuetracking \
                          -DartifactId=issuetracking \
                          -Dversion=1.0.${BUILD_NUMBER} \
                          -Dpackaging=jar \
                          -DgeneratePom=true \
                          -DrepositoryLayout=default \
                          -Dusername=$NEXUS_USER \
                          -Dpassword=$NEXUS_PASS
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completada correctamente'
        }
        failure {
            echo '❌ Algo falló'
        }
    }
}

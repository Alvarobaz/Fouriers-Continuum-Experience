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

                    sh '''
                    mkdir -p ~/.m2

                    cat > ~/.m2/settings.xml <<EOF
<settings>
  <servers>
    <server>
      <id>nexus</id>
      <username>${NEXUS_USER}</username>
      <password>${NEXUS_PASS}</password>
    </server>
  </servers>
</settings>
EOF
                    '''

                    dir('Back-End') {
                        sh '''
                        echo "🚀 Deployando a Nexus..."

                        mvn deploy:deploy-file \
                          -DrepositoryId=nexus \
                          -Durl=http://nexus:8081/repository/maven-releases/ \
                          -Dfile=target/issuetracking-0.0.1-SNAPSHOT.jar \
                          -DgroupId=com.mycompany.issuetracking \
                          -DartifactId=issuetracking \
                          -Dversion=1.0.${BUILD_NUMBER} \
                          -Dpackaging=jar \
                          -DgeneratePom=true
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ TODO SUBIDO A NEXUS'
        }
        failure {
            echo '❌ FALLÓ EL DEPLOY'
        }
    }
}

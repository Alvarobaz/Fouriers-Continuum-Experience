node {
    stage('SCM') {
        echo 'Obteniendo código desde Git...'
        checkout scm
    }
    
    stage('Build') {
        echo 'Compilando el proyecto...'
       
        sh 'mvn clean package'
    }

    stage('SonarQube Analysis') {
        echo 'Analizando calidad con SonarQube...'
       
        def scannerHome = tool 'SonarScanner'
       
        withSonarQubeEnv('SonarQube') {
            sh "${scannerHome}/bin/sonar-scanner"
        }
    }
}

#!groovy
properties([
    pipelineTriggers([
        pollSCM('H/5 * * * *')
    ])
])
node ('default-lower') {
    configFileProvider([configFile(fileId: '9b23762f-2845-4626-9cf2-4236ce3c9965', variable: 'FILE')]) {
        echo "FILE=$FILE"
        load "$FILE"
    }
}
pipeline {
  agent { label 'default-lower' }
  stages{
    stage('Get Code') {
      steps {
          deleteDir()
          checkout ([
              $class: 'GitSCM',
              branches: scm.branches,
              doGenerateSubmoduleConfigurations: scm.doGenerateSubmoduleConfigurations,
              extensions: [[$class: 'CloneOption', noTags: false, shallow: false, depth: 0, reference: '']],
              userRemoteConfigs: scm.userRemoteConfigs,
           ])
           script {
               tag=sh(returnStdout: true, script: "git tag -l --points-at HEAD").trim()
               env.tag = tag
             }
      }
    }
    stage('GetOpsScripts') {
      steps {
        echo "GETTING SCRIPTS"
        sh '''
        git clone git@github.com:nci-hcmi-catalog/portal-ci.git
        '''
      }
    }
    stage('Build') {
      steps {
        sh '''
        portal-ci/build_stage/build.sh portal-ci
        '''
      }
    }
    stage('Deploy Dev') {
      steps {
        echo "DEPLOYING TO DEVELOPMENT: (${env.BUILD_URL})"
        sshagent (credentials: ["$DEV_CREDS"]) {
          sh (returnStdout: false, script: "ssh -o StrictHostKeyChecking=no $DEV_SERVER \"set -x; if [ ! -d $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ ]; then mkdir -p $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ || exit \$?; fi\" && scp portal.tar portal-ci/deploy_stage/deploy.sh $DEV_SERVER:$REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ && ssh -o StrictHostKeyChecking=no $DEV_SERVER \"set -x; cd $REMOTE_DIR/hcmi && bash deploy/$BUILD_NUMBER/deploy.sh dev $BUILD_NUMBER REACT_APP_ARRANGER_API=http://${DEV_SERVER}:5050/ REACT_APP_ES_HOST=http://es.hcmi.cancercollaboratory.org:9200 REACT_APP_VERSION=june07 SKIP_PREFLIGHT_CHECK=true\""
          )
        }
        echo "DEPLOYED TO DEVELOPMENT: (${env.BUILD_URL})"
      }
      post {
        failure {
          echo "Deploy Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
        }
      }
    }
    stage('Deploy QA') {
      when {
       expression {
           return env.BRANCH_NAME == 'master';
       }
     }
      steps {
     echo "DEPLOYING TO QA: (${env.BUILD_URL})"
        sshagent (credentials: ["$QA_CREDS"]) {
          sh (returnStdout: false, script: "ssh -o StrictHostKeyChecking=no $QA_SERVER \"set -x; if [ ! -d $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ ]; then mkdir -p $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ || exit \$?; fi\" && scp portal.tar portal-ci/deploy_stage/deploy.sh $QA_SERVER:$REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ && ssh -o StrictHostKeyChecking=no $QA_SERVER \"set -x; cd $REMOTE_DIR/hcmi && bash deploy/$BUILD_NUMBER/deploy.sh qa $BUILD_NUMBER REACT_APP_ARRANGER_API=http://${QA_SERVER}:5050/ REACT_APP_ES_HOST=http://es.hcmi.cancercollaboratory.org:9200 REACT_APP_VERSION=june07 SKIP_PREFLIGHT_CHECK=true\""
          )
        }
        
       echo "DEPLOYED TO QA: (${env.BUILD_URL})"
     }
     post {
       failure {
         echo "Deploy Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
       }
     }
    }
  }
}


#!groovy
void failSafeBuild(cmsConfigId, apiConfigId, uiConfigId){
    try {
        echo 'BUILD_STEP_SUCCESS=no'
        configFileProvider([configFile(fileId: cmsConfigId, targetLocation: './cms/pm2.config.js'),
                            configFile(fileId: apiConfigId, targetLocation: './api/pm2.config.js'),
                            configFile(fileId: uiConfigId, targetLocation: './ui/.env')]){
                                
                            
        sh '''
        portal-ci/build_stage/build.sh portal-ci
        '''
        echo 'BUILD_STEP_SUCCESS=yes'
        }
    } catch (err) {
       echo 'BUILD_STEP_SUCCESS=no'
    }
}

void getPipelineResult (){
    script {
        // fail the build if all deployment stages were skipped
        if(env.DEV_DEPLOYMENT_STATUS == null && env.QA_DEPLOYMENT_STATUS == null && env.PRD_DEPLOYMENT_STATUS == null) {
            echo 'Build failed because application was not deployed to any environment.'
            echo 'Please make sure Jenkins has all required configuration files and variables.'
            currentBuild.result = 'FAILURE'
        }
    }
}

properties([
    pipelineTriggers([
        pollSCM('H/5 * * * *')
    ])
])
node ('default-lower||master') {
    configFileProvider([configFile(fileId: 'hcmi-env-config', variable: 'FILE')]) {
        echo "FILE=$FILE"
        load "$FILE"
    }
}
pipeline {
  agent { label 'default-lower||master' }
  stages{
    stage('Get Code') {
      steps {
        echo "Workspace directory is ${env.WORKSPACE}"
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
        git clone '''+PORTAL_CI_URL+'''
        '''
      }
    }
    stage('Build Dev') {
      steps {
        failSafeBuild('hcmi-cms-dev-config','hcmi-api-dev-config','hcmi-ui-dev-config')
      }
    }
    stage('Deploy Dev') {
      when{
        environment name: 'BUILD_STEP_SUCCESS', value: 'yes'
      }
      steps {
        echo "DEPLOYING TO DEVELOPMENT: (${env.BUILD_URL})"
        sshagent (credentials: ["$DEV_CREDS"]) {
          sh (returnStdout: false, script: "ssh -o StrictHostKeyChecking=no $APP_USER@$DEV_SERVER \"set -x; if [ ! -d $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ ]; then mkdir -p $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ || exit \$?; fi\" && scp portal.tar portal-ci/deploy_stage/deploy.sh $APP_USER@$DEV_SERVER:$REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ && ssh -o StrictHostKeyChecking=no $APP_USER@$DEV_SERVER \"set -x; cd $REMOTE_DIR/hcmi && bash deploy/$BUILD_NUMBER/deploy.sh dev $BUILD_NUMBER REACT_APP_ARRANGER_API=https://hcmi-searchable-catalog-dev.nci.nih.gov/api/ REACT_APP_ES_HOST=http://ncias-d2019-v:9200 REACT_APP_VERSION=rb-02 SKIP_PREFLIGHT_CHECK=true\""
          )
        }
        echo "DEPLOYED TO DEVELOPMENT: (${env.BUILD_URL})"
        echo "DEV_DEPLOYMENT_STATUS=SUCCESS"
      }
      post {
        failure {
          echo "Deploy Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
        }
      }
    }
    stage('Build QA') {
      steps {
        failSafeBuild('hcmi-cms-qa-config','hcmi-api-qa-config','hcmi-ui-qa-config')
      }
    }
    stage('Deploy QA') {
      when {
       environment name: 'BUILD_STEP_SUCCESS', value: 'yes'
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
       echo "QA_DEPLOYMENT_STATUS=SUCCESS"
     }
     post {
       failure {
         echo "Deploy Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
       }
     }
    }
    stage('Build PRD') {
      steps {
        failSafeBuild('hcmi-cms-prod-config','hcmi-api-prod-config','hcmi-ui-prod-config')
      }
    }
    stage('Deploy PRD') {
      when {
       environment name: 'BUILD_STEP_SUCCESS', value: 'yes'
       expression {
           return env.BRANCH_NAME == 'master';
       }
       expression {
           return tag != '';
       }
     }
      steps {
     echo "DEPLOYING TO PRD: (${env.BUILD_URL})"
        sshagent (credentials: ["$PRD_CREDS"]) {
          sh (returnStdout: false, script: "ssh -o StrictHostKeyChecking=no $PRD_SERVER \"set -x; if [ ! -d $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ ]; then mkdir -p $REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ || exit \$?; fi\" && scp portal.tar portal-ci/deploy_stage/deploy.sh $QA_SERVER:$REMOTE_DIR/hcmi/deploy/$BUILD_NUMBER/ && ssh -o StrictHostKeyChecking=no $QA_SERVER \"set -x; cd $REMOTE_DIR/hcmi && bash deploy/$BUILD_NUMBER/deploy.sh qa $BUILD_NUMBER REACT_APP_ARRANGER_API=http://${QA_SERVER}:5050/ REACT_APP_ES_HOST=http://es.hcmi.cancercollaboratory.org:9200 REACT_APP_VERSION=june07 SKIP_PREFLIGHT_CHECK=true\""
          )
        }
        
       echo "DEPLOYED TO PRD: (${env.BUILD_URL})"
       echo "PRD_DEPLOYMENT_STATUS=SUCCESS"
     }
     post {
       failure {
         echo "Deploy Failed: Branch '${env.BRANCH_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})"
       }
     }
    }
  }
  post{
    always {
        getPipelineResult()
    }
  }
}
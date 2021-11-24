import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
import reducers, { namespace } from './states';

const PLUGIN_NAME = 'RingtonePlugin';

export default class RingtonePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);
    let alertSound = new Audio("https://tumbleweed-penguin-7678.twil.io/assets/AgentDesktopRingtone.mp3");
    alertSound.loop = true;

    const resStatus = ["accepted","canceled","rejected","rescinded","timeout"];

     manager.workerClient.on("reservationCreated", function(reservation) {
       if (reservation.task.taskChannelUniqueName === 'voice') {
        alertSound.play()
       };
  resStatus.forEach((e) => {
    reservation.on(e, () => {
      alertSound.pause()
    });
  });
});

manager.voiceClient.on("disconnect", connection => {

  !('conversations' in reservation.task.attributes) && (reservation.task.attributes.conversations = {});

if(reservation.task.attributes.conversations.hang_up_by === undefined) {

reservation.task.attributes.conversations.hang_up_by = 'Customer';

reservation.task.setAttributes(reservation.task.attributes);

}

});

flex.Actions.addListener("afterHangupCall",(payload) => {

  !('conversations' in payload.task.attributes) && (payload.task.attributes.conversations = {});

  payload.task.attributes.conversations.hang_up_by = 'Agent';

  payload.task.setAttributes(payload.task.attributes);

  console.log('########## HangupCall', payload);

});

}

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);
  }
}

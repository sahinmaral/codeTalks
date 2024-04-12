import {formatDistance, parseISO} from 'date-fns';
import React from 'react';
import {Text, View} from 'react-native';
import {tr} from 'date-fns/locale';
import styles from '../MessageCard/MessageCard.styles';


function MessageCard({messageDetail}) {
  return (
    <View style={styles.container}>
      <View style={styles.top.container}>
        <Text style={styles.text}>{messageDetail.sender.userName}</Text>
        <Text style={[styles.text, {fontStyle: 'italic'}]}>
          {formatDistance(
            parseISO(new Date(messageDetail.createdAt).toISOString()),
            new Date(),
            {
              addSuffix: true,
              locale: tr,
            },
          )}
        </Text>
      </View>
      <View style={styles.bottom.container}>
        <Text style={[styles.text, styles.bottom.text]}>
          {messageDetail.content}
        </Text>
      </View>
    </View>
  );
}

export default MessageCard;

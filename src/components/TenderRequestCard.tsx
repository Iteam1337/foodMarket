import { StyleSheet } from 'react-native'
import { Button, Card } from 'react-native-paper'
import { TenderRequest } from '../data/tenderRequests'
import useAuth from '../hooks/useAuth'

const TenderRequestCard = ({
  tenderRequest,
  navigation,
}: {
  tenderRequest: TenderRequest
  navigation: any
  user: ReturnType<typeof useAuth>['user']
}) => {
  return (
    <Card
      style={styles.card}
      onPress={() =>
        navigation.navigate('TenderRequest', {
          tenderRequestId: tenderRequest.id,
        })
      }
    >
      <Card.Title
        title={tenderRequest.title}
        titleVariant="titleSmall"
        titleStyle={{
          fontSize: 14,
        }}
        subtitle={
          'Tilldelningsdatum: ' +
          tenderRequest.lastAwardDate?.toString().split('T')[0]
        }
        right={(props) => <Button icon="chevron-right" />}
      ></Card.Title>
    </Card>
  )
}

export default TenderRequestCard

const styles = StyleSheet.create({
  header: {
    margin: 16,
  },
  card: {
    margin: 10,
    backgroundColor: 'white',
  },
  infoCard: {
    marginTop: 5,
    marginBottom: 5,
  },
})

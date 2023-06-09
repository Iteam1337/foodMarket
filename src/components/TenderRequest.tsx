import { useEffect, useLayoutEffect, useState } from 'react'
import {
  Caption,
  Headline,
  Subheading,
  useTheme,
  Text,
  Button,
  Paragraph,
  Divider,
  Card,
  List,
  Avatar,
} from 'react-native-paper'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Tabs, TabScreen } from 'react-native-paper-tabs'
import Chat from './Chat'
import useTenderRequests from '../hooks/useTenderRequests'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import useAuth from '../hooks/useAuth'
import { TenderRequest as TenderRequestType } from '../data/tenderRequests'
import useOffers from '../hooks/useOffers'
import { Offer } from '../data/offers'

const ChevronRight = () => (
  <MaterialCommunityIcons
    size={25}
    style={{ marginRight: 20 }}
    name="chevron-right"
  />
)

const TenderRequest = ({
  route,
  navigation,
}: {
  route: any
  navigation: any
}) => {
  const [tenderRequests, , , refreshTenderRequests] = useTenderRequests()
  const [tenderRequest, setTenderRequest] = useState<
    TenderRequestType | undefined
  >(route.params.tenderRequest as TenderRequestType)
  const theme = useTheme()
  const { user } = useAuth()
  const [offers, updateOffer, , refreshOffers] = useOffers()

  useEffect(() => {
    if (route.params.tenderRequestId) {
      const tenderRequestFromState = tenderRequests.find(
        ({ id }) => id === route.params.tenderRequestId
      )
      if (tenderRequestFromState) {
        setTenderRequest(tenderRequestFromState)
      }
    }
  }, [route.params.tenderRequestId, tenderRequests])

  useEffect(() => {
    const buyer = user?.type === 'buyer' ? user : undefined
    const supplier = user?.type === 'supplier' ? user : undefined
    refreshOffers({ buyer, supplier })
    refreshTenderRequests()
  }, [user])

  if (!tenderRequest)
    return (
      <Text>
        Ladda via parametrar stöds ej än: {route.params.tenderRequestId}
      </Text>
    )

  const validOffers = offers
    .filter((offer) => offer.tenderRequestId === tenderRequest?.id)
    .filter(
      (offer) => offer.buyer.id === user?.id || offer.supplier.id === user?.id
    )
    .sort((a, b) => a.price.SEK - b.price.SEK)

  return (
    <>
      <View style={{ ...styles.header }}>
        <Headline>{tenderRequest.title}</Headline>
        <Subheading>{tenderRequest.buyer?.name}</Subheading>
      </View>
      <Tabs
        // defaultIndex={0} // default = 0
        uppercase={false} // true/false | default=true | labels are uppercase
        // showTextLabel={false} // true/false | default=false (KEEP PROVIDING LABEL WE USE IT AS KEY INTERNALLY + SCREEN READERS)
        // iconPosition // leading, top | default=leading
        style={{ backgroundColor: '#D8F5E3' }}
        // dark={false} // works the same as AppBar in react-native-paper
        theme={theme} // works the same as AppBar in react-native-paper
        // mode="scrollable" // fixed, scrollable | default=fixed
        // onChangeIndex={(newIndex) => {}} // react on index change
        // showLeadingSpace={true} //  (default=true) show leading space in scrollable tabs inside the header
        // disableSwipe={false} // (default=false) disable swipe to left/right gestures
      >
        <TabScreen label="Förfrågan">
          <ScrollView>
            <Container>
              <Row>
                <Column>
                  <Caption>Sista svar</Caption>
                  <Text>
                    {tenderRequest.lastOfferDate?.toString().split('T')[0] ||
                      'Inget datum'}
                  </Text>
                </Column>
                <Column>
                  <Caption>Tilldelning senast</Caption>
                  <Text>
                    {tenderRequest.lastAwardDate?.toString().split('T')[0] ||
                      'Inget datum'}
                  </Text>
                </Column>
              </Row>
            </Container>
            <Container>
              <Row>
                <Column>
                  <Caption>Leveransplan</Caption>
                  <Text>{tenderRequest.deliveryPlan}</Text>
                </Column>
                <Column>
                  <Caption>Första leverans</Caption>
                  <Text>
                    {tenderRequest.deliveryStartDate?.toString().split('T')[0]}
                  </Text>
                </Column>
              </Row>
            </Container>
            <Container>
              <Subheading>Villkor</Subheading>
              <Paragraph>{tenderRequest.terms}</Paragraph>
            </Container>
            <Divider />
            <Container>
              <Subheading>Urval</Subheading>
              <Paragraph>{tenderRequest.grading}</Paragraph>
            </Container>
            <Container>
              <Subheading>Krav</Subheading>
              {tenderRequest.qualificationCriteria?.map((criteria, i) => (
                <Paragraph key={i}>{criteria}</Paragraph>
              ))}
            </Container>
            <Container>
              <Subheading>Önskemål</Subheading>
              {tenderRequest.optionalCriteria?.map((optionalCriteria, i) => (
                <Paragraph key={i}>{optionalCriteria}</Paragraph>
              ))}
            </Container>
            <Container
              style={{
                flexDirection: 'row',
                display: 'flex',
                backgroundColor: '#DCF6FE',
                margin: 20,
                padding: 10,
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              <MaterialCommunityIcons
                name="exclamation"
                color="black"
                size={20}
              />
              <Paragraph style={{ paddingLeft: 10, paddingRight: 20 }}>
                Ett uppfyllt önskemål genererar, i jämförelsen mot andra anbud,
                ett prisavdrag motsvarande det uppskattade värdet. Offererat
                pris är fortfarande det som gäller vid fakturering.
              </Paragraph>
            </Container>
          </ScrollView>
        </TabScreen>
        <TabScreen label="Meddelande">
          <Chat />
        </TabScreen>
        <TabScreen label="Anbud">
          <>
            <>
              {user?.type === 'supplier' && (
                <Container>
                  {!validOffers.length && (
                    <>
                      <Paragraph>
                        För att lämna anbud måste du vara ansluten till detta
                        DIS. För att kontrollera att du är det kan du gå till
                        xx..yy.z
                      </Paragraph>
                      <Button
                        mode="contained"
                        onPress={() => {
                          navigation.navigate('TenderRequests', {
                            screen: 'CreateOffer',
                            params: {
                              tenderRequest,
                            },
                          })
                        }}
                      >
                        Lämna anbud
                      </Button>
                    </>
                  )}
                  <List.Section>
                    <List.Subheader>Dina skickade anbud</List.Subheader>
                    {validOffers.map((offer, i) => (
                      <Card
                        key={i}
                        style={styles.card}
                        onPress={() => {
                          console.log('pressed', offer)
                          navigation.navigate('Supplier', {
                            supplier: offer.supplier,
                          })
                        }}
                      >
                        <Card.Title
                          titleVariant="titleSmall"
                          titleStyle={{
                            fontSize: 14,
                          }}
                          left={(props) => (
                            <MaterialCommunityIcons
                              name="file-document-outline"
                              color="black"
                              size={24}
                            />
                          )}
                          title={offer.price.SEK + ' kr'}
                          subtitle={
                            'Inlämnad ' +
                            offer.submissionDate?.toString().split('T')[0] +
                            '. ' +
                            (offer.approved ? 'Vunnen' : 'Ej godkänt')
                          }
                          right={(props) => <ChevronRight />}
                        />
                      </Card>
                    ))}
                  </List.Section>
                </Container>
              )}
            </>
            {user?.type === 'buyer' && tenderRequest.buyer?.id == user?.id && (
              <>
                <Container>
                  <Paragraph>
                    Inskickade anbud sorteras efter lägsta pris med eventuella
                    avdrag för uppfyllda önskemål.
                  </Paragraph>
                </Container>
                <Container>
                  <Subheading>Matchande anbud</Subheading>
                  {validOffers.map((offer, i) => (
                    <Card
                      key={i}
                      style={styles.card}
                      //  onPress={() => navigation.navigate('TenderRequest', { id })}
                    >
                      <Card.Title
                        titleVariant="titleSmall"
                        titleStyle={{
                          fontSize: 14,
                        }}
                        title={
                          offer.price.SEK + ' kr från: ' + offer.supplier?.name
                        }
                        subtitle={
                          'Inkom ' +
                          offer.submissionDate?.toString().split('T')[0]
                        }
                        right={(props) => {
                          if (offer.approved)
                            return (
                              <Container
                                style={{
                                  flexDirection: 'row',
                                  display: 'flex',
                                }}
                              >
                                <MaterialCommunityIcons
                                  size={25}
                                  name="clipboard-check"
                                />
                                <Text
                                  style={{
                                    marginLeft: 5,
                                    marginTop: 5,
                                  }}
                                >
                                  Tilldelad
                                </Text>
                              </Container>
                            )
                          else if (
                            offers.filter((offer) => offer.approved).length < 1
                          )
                            return (
                              <Button
                                icon="clipboard-check"
                                mode="contained"
                                uppercase={false}
                                style={{ marginRight: 10 }}
                                onPress={() => {
                                  console.log('offer', offer)
                                  updateOffer({ ...offer, approved: true })
                                }}
                              >
                                Tilldela
                              </Button>
                            )
                        }}
                      />
                    </Card>
                  ))}
                </Container>
                <Container>
                  <Divider />
                  <Subheading>Ej uppfyllda anbud</Subheading>
                </Container>
              </>
            )}
            {user?.type === 'buyer' && tenderRequest.buyer?.id != user?.id && (
              <Container>
                <Paragraph>
                  Som beställare kan du inte lämna anbud på andra beställares
                  anbudsförfrågningar.
                </Paragraph>
              </Container>
            )}
          </>
        </TabScreen>
      </Tabs>
    </>
  )
}

const Row = ({ children }) => (
  <View style={{ flexDirection: 'row' }}>{children}</View>
)

const Column = ({ children }) => (
  <View style={{ flexDirection: 'column', marginRight: 20 }}>{children}</View>
)

const Container = ({ children, style }: { children: any; style?: any }) => (
  <View style={{ ...styles.container, ...style }}>{children}</View>
)

export default TenderRequest

const styles = StyleSheet.create({
  header: {
    margin: 16,
  },
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 5,
  },
  card: {
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'white',
  },
})

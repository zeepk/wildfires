import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import MapView from 'react-native-maps';

const coords = [44.967243, -103.771556];
const API_URL =
	'https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Active_Fires/FeatureServer/0/query?where=1%3D1&outFields=ContainmentDateTime,ControlDateTime,CreatedOnDateTime,DailyAcres,DiscoveryAcres,FireBehaviorGeneral,FireBehaviorGeneral1,FireBehaviorGeneral2,FireBehaviorGeneral3,FireCause,FireCauseGeneral,FireCauseSpecific,FireDiscoveryDateTime,FireOutDateTime,IncidentName,IncidentShortDescription,IncidentTypeCategory,IncidentTypeKind,InitialLatitude,InitialLongitude,InitialResponseAcres,InitialResponseDateTime,IsFireCauseInvestigated,IsQuarantined,IsValid,PercentContained,PercentPerimeterToBeContained,POOCity,POOCounty,POOState,TotalIncidentPersonnel,CreatedOn,ModifiedOn,GlobalID,ModifiedOnDateTime_dt,CreatedOnDateTime_dt,CalculatedAcres,FireCode,ModifiedOnDateTime,IsDispatchComplete&outSR=4326&f=json';
export default function App() {
	const [data, setData] = useState(null);
	const [fires, setFires] = useState([]);

	// API call to get data
	useEffect(() => {
		fetch(API_URL)
			.then((response) => response.json())
			.then((data) => setData(data));
	}, []);

	// creating array of fire data
	if (data && fires.length === 0) {
		const firesToPush = data.features.map((fireData) => {
			return {
				data: fireData.attributes,
				lat: fireData.attributes.InitialLatitude,
				lng: fireData.attributes.InitialLongitude,
			};
		});
		// props.toUpdateLastUpdated(data);
		setFires(firesToPush);
	}
	return (
		<View style={styles.container}>
			{/* <Text style={{ color: 'white' }}>Wildfires!</Text> */}
			{/* <StatusBar style="auto" /> */}
			<MapView
				style={{
					flex: 1,
					width: '100%',
					height: '50%',
				}}
				region={{
					latitude: coords[0],
					longitude: coords[1],
					latitudeDelta: 100,
					longitudeDelta: 100,
				}}
				showsUserLocation={true}
			>
				<MapView.Marker
					coordinate={{ latitude: 64.967243, longitude: -103.771556 }}
					onPress={() => console.log('fireData.data')}
				></MapView.Marker>
				{fires
					.filter((fire) => fire.lat && fire.lng)
					.map((fireData) => {
						return (
							<MapView.Marker
								key={fireData.data}
								coordinate={{ latitude: fireData.lat, longitude: fireData.lng }}
								// coordinate={{ latitude: 44.967243, longitude: -103.771556 }}
								// onPress={() => console.log(fireData.data)}
							>
								<MapView.Callout tooltip={false}>
									<View>
										<Text>{fireData.data.IncidentName}</Text>
									</View>
								</MapView.Callout>
							</MapView.Marker>
						);
					})}
			</MapView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
});

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import MapView from 'react-native-maps';
import moment from 'moment';

const coords = [44.967243, -153.771556];
const fields = [
	{ apikey: 'IncidentName', name: 'Name' },
	{ apikey: 'FireDiscoveryDateTime', name: 'Discovered' },
	{ apikey: 'IncidentShortDescription', name: 'Desc.' },
	{ apikey: 'POOState', name: 'State' },
	{ apikey: 'POOCounty', name: 'County' },
	{ apikey: 'FireCause', name: 'General Cause' },
	{ apikey: 'FireCauseGeneral', name: 'Specific Cause' },
	{ apikey: 'FireBehaviorGeneral', name: 'Severity' },
	{ apikey: 'PercentContained', name: 'Contained' },
	{ apikey: 'TotalIncidentPersonnel', name: 'Responders' },
	{ apikey: 'DailyAcres', name: 'Acres' },
	{ apikey: 'DailyAcres', name: 'Sq Miles' },
	{ apikey: 'ModifiedOnDateTime_dtd', name: 'Last Updated' },
];
const API_URL =
	'https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/Active_Fires/FeatureServer/0/query?where=1%3D1&outFields=ContainmentDateTime,ControlDateTime,CreatedOnDateTime,DailyAcres,DiscoveryAcres,FireBehaviorGeneral,FireBehaviorGeneral1,FireBehaviorGeneral2,FireBehaviorGeneral3,FireCause,FireCauseGeneral,FireCauseSpecific,FireDiscoveryDateTime,FireOutDateTime,IncidentName,IncidentShortDescription,IncidentTypeCategory,IncidentTypeKind,InitialLatitude,InitialLongitude,InitialResponseAcres,InitialResponseDateTime,IsFireCauseInvestigated,IsQuarantined,IsValid,PercentContained,PercentPerimeterToBeContained,POOCity,POOCounty,POOState,TotalIncidentPersonnel,CreatedOn,ModifiedOn,GlobalID,ModifiedOnDateTime_dt,CreatedOnDateTime_dt,CalculatedAcres,FireCode,ModifiedOnDateTime,IsDispatchComplete&outSR=4326&f=json';

export default function App() {
	const colorReturn = (severity) => {
		switch (severity) {
			case 'Minimal':
				return '#0f571a';
			case 'Active':
			case 'Moderate':
				return '#55570f';
			case 'Extreme':
				return '#570f0f';
			default:
				return '#212121';
		}
	};

	const listItem = (name, value, index) => {
		switch (name) {
			case 'Contained':
				value = value ? (value += '%') : 'Unknown';
				break;
			case 'Last Updated':
			case 'Discovered':
				value = moment(value).format('MMM DD YYYY, h:mm a');
				break;
			case 'State':
				value = value.split('-')[1];
				break;
			case 'Responders':
				value = value ? `${value}🚨` : 'Unknown';
				break;
			case 'Sq Miles':
				value = value ? Math.round((value / 640) * 10) / 10 : '';
				break;
		}

		return (
			<View
				key={name}
				style={{
					flex: 1,
					flexDirection: 'row',
					backgroundColor: `${index % 2 === 0 ? '#2e2e2e' : '#1f1f1f'}`,
					padding: 5,
					width: 300,
				}}
			>
				<View style={{ flex: 2, flexDirection: 'row', padding: 5 }}>
					<Text style={{ color: 'white', flex: 1 }}>{name}</Text>
				</View>
				<View
					style={{
						padding: 5,
						borderRadius: '30%',
						backgroundColor: `${name === 'Severity' ? colorReturn(value) : ''}`,
					}}
				>
					<Text
						style={{
							color: 'white',
							flex: 1,
						}}
					>
						{value}
					</Text>
				</View>
			</View>
		);
	};
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
			<MapView
				style={{
					flex: 1,
					width: '100%',
					height: '50%',
				}}
				region={{
					latitude: coords[0],
					longitude: coords[1],
					latitudeDelta: 50,
					longitudeDelta: 50,
				}}
				showsUserLocation={true}
			>
				{fires
					.filter((fire) => fire.lat && fire.lng)
					.map((fireData, index) => {
						return (
							<MapView.Marker
								key={index}
								coordinate={{ latitude: fireData.lat, longitude: fireData.lng }}
							>
								<MapView.Callout tooltip={true}>
									<View>
										<FlatList
											style={{ borderRadius: '10%' }}
											data={fields}
											keyExtractor={(item) => item.name}
											renderItem={(item) =>
												listItem(
													item.item.name,
													fireData.data[item.item.apikey],
													item.index
												)
											}
										/>
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
	item: {
		backgroundColor: '#f9c2ff',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
	},
	title: {
		fontSize: 32,
	},
});

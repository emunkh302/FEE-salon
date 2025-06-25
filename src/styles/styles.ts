import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  content: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  form: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { height: 44, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, marginBottom: 16, paddingHorizontal: 10, backgroundColor: '#fff', fontSize: 16 },
  separator: { marginVertical: 20, height: 1, width: '80%', backgroundColor: '#e0e0e0', alignSelf: 'center' },
  listContent: { padding: 8 },
  artistCard: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginVertical: 8, marginHorizontal: 8, flexDirection: 'row', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3 },
  artistImage: { width: 60, height: 60, borderRadius: 30, marginRight: 16, backgroundColor: '#eee' },
  artistInfo: { flex: 1 },
  artistName: { fontSize: 18, fontWeight: 'bold' },
  artistBio: { fontSize: 14, color: '#666', marginTop: 4 },
  artistDetails: { fontSize: 12, color: '#888', marginTop: 8 },
  detailContent: { flex:1, paddingTop: 20, alignItems: 'center' },
  detailImage: { width: 150, height: 150, borderRadius: 75, marginBottom: 16 },
  detailName: { fontSize: 26, fontWeight: 'bold' },
  detailRating: { fontSize: 16, color: '#444', marginTop: 4 },
  detailBio: { fontSize: 16, textAlign: 'center', color: '#333', lineHeight: 24, marginHorizontal: 10 },
  detailExperience: { fontSize: 14, color: '#555', marginTop: 10, fontStyle: 'italic' },
  
  // --- NEW STYLES ---
  servicesHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 16,
    marginBottom: 10,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  serviceBooking: {
      alignItems: 'center'
  }
});
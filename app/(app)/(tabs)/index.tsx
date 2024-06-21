// import { Link } from 'expo-router';
// import { useEffect, useState } from 'react';
// import { ScrollView, StyleSheet, View } from 'react-native';
// import { Button } from 'react-native-paper';
// import Fallback from '../../../components/Fallback';
// import { getAllCollectionNamesSorted } from '../../../database/db.config';
// import { ELEMENT_WIDTH } from '../../../global';

// const HomeScreen = () => {
//   const [collectionNames, setCollectionNames] = useState<string[]>([]);

//   useEffect(() => {
//     const getCollections = async () => {
//       const collections = await getAllCollectionNamesSorted();
//       setCollectionNames(collections ?? []);
//     };
//     getCollections();
//   }, []);

//   if (!collectionNames.length) return <Fallback duration={3000} />;

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollViewContent}
//       >
//         {collectionNames.map((collectionName, index) => (
//           <Link
//             key={index}
//             push
//             href={{
//               pathname: '/swish',
//               params: { collection: collectionName },
//             }}
//             asChild
//           >
//             <Button mode="contained" style={styles.button}>
//               {collectionName}
//             </Button>
//           </Link>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//   },
//   scrollView: {
//     width: '100%',
//     paddingVertical: 20,
//   },
//   scrollViewContent: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 20,
//   },
//   button: {
//     width: ELEMENT_WIDTH,
//     height: 50,
//     justifyContent: 'center',
//   },
// });

// export default HomeScreen;

import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import {
  fetchCollectionCount
} from '../../../database/db.config';
import { ELEMENT_WIDTH } from '../../../global';

const DEFAULT_LIMIT = 10;

const HomeScreen = () => {
  const [collectionCount, setCollectionCount] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  useEffect(() => {
    const fetchCollections = async () => {
      const res = await fetchCollectionCount(limit);
      if (res) setCollectionCount(res);
      else console.error('No collection count');
    };

    fetchCollections();
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {Array.from({ length: collectionCount }, (_, index) => index).map(
          (index) => (
            <Link
              key={index}
              push
              href={{
                pathname: '/swish',
                params: { from: index*limit, to: index*limit+limit-1 },
              }}
              asChild
            >
              <Button mode="contained" style={styles.button}>
                {`Collection ${index + 1}`}
              </Button>
            </Link>
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  scrollView: {
    width: '100%',
    paddingVertical: 20,
  },
  scrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: ELEMENT_WIDTH,
    height: 50,
    justifyContent: 'center',
  },
});

export default HomeScreen;

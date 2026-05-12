import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonText
} from "@ionic/react";
import { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
  image: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setError(null);

      const res = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=10"
      );

      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();

      const enriched = data.map((item: any) => ({
        ...item,
        image: `https://picsum.photos/seed/${item.id}/400/200`
      }));

      setPosts(enriched);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleRefresh = async (event: CustomEvent) => {
    await fetchPosts();
    event.detail.complete();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>

          <IonTitle>Feed</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>

        {/* Pull to refresh */}
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="ion-padding">

          {/* Loading */}
          {loading && <IonSpinner name="crescent" />}

          {/* Error */}
          {error && (
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          )}

          {/* Posts */}
          {!loading &&
            !error &&
            posts.map(post => (
              <IonCard key={post.id} routerLink={`/feed/${post.id}`} button>

                <IonImg src={post.image} alt={post.title} />

                <IonCardHeader>
                  <IonCardTitle>{post.title}</IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                  {post.body}
                </IonCardContent>

              </IonCard>
            ))}

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Feed;
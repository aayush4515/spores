import { Link } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import PageSkeleton from "../components/PageSkeleton";
import SporeCard from "../components/SporeCard";
import { useAppState } from "../context/AppStateContext";
import useFakeLoading from "../hooks/useFakeLoading";

function SporesPage() {
  const { state } = useAppState();
  const { settings } = state;
  const isLoading = useFakeLoading();

  const spores = state.spores.filter((s) => settings.activeSporeIds.includes(s.id));

  if (isLoading) return <PageSkeleton cards={3} />;

  return (
    <section>
      <PageHeader
        title="My Spores"
        subtitle="Circles you’re tending—tap one to see the people inside."
        action={
          <Link className="link-button" to="/create-spore">
            + Create spore
          </Link>
        }
      />
      <div className="spore-grid">
        {spores.map((spore) => (
          <SporeCard key={spore.id} spore={spore} />
        ))}
        {spores.length === 0 && (
          <article className="card" style={{ gridColumn: "1 / -1" }}>
            <p className="muted" style={{ margin: 0 }}>
              No spores are active. Turn them on in{" "}
              <Link to="/settings">Settings</Link>.
            </p>
          </article>
        )}
      </div>
    </section>
  );
}

export default SporesPage;

import Panel from "../ui/Panel";
import Button from "../ui/Button";

type Props = {
  onBack: () => void;
};

export default function RulesModal({ onBack }: Props) {
  return (
    <Panel className="mx-auto max-w-5xl p-6 text-stone-100 sm:p-8">
      <h2 className="mb-6 text-3xl font-semibold text-amber-300">Rules</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 text-stone-200">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 text-xl font-semibold text-amber-200">How to Play</h3>
            <ul className="space-y-2">
              <li>You roll six dice at the start of your turn.</li>
              <li>Select scoring dice and hold them aside.</li>
              <li>Then roll the remaining dice again.</li>
              <li>If you roll no scoring dice, you bust and lose all points from that turn.</li>
              <li>If all rolled dice score, you get hot dice and all six dice return for another roll in the same turn.</li>
              <li>You can bank your turn points instead of rolling again.</li>
              <li>The first player to reach the target score wins.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 text-xl font-semibold text-amber-200">Special Dice Notes</h3>
            <ul className="space-y-2 text-stone-200">
              <li>Holy face only exists on Holy die when it rolls 1.</li>
              <li>Devil face only exists on Devil die when it rolls 1.</li>
              <li>Joker face only exists on Joker die when it rolls 1.</li>
              <li>Block dice can block one or more values for the entire next roll.</li>
              <li>Devil 666 creates a 6-turn reward effect.</li>
              <li>A lone Devil face causes a 1000-point penalty and the turn still busts.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-4 text-xl font-semibold text-amber-200">Scoring</h3>

          <div className="space-y-5 text-stone-200">
            <div>
              <h4 className="mb-2 font-semibold text-amber-100">Single Dice</h4>
              <ul className="space-y-1">
                <li>Single 1 = 100</li>
                <li>Single 5 = 50</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-amber-100">Straights / Runs</h4>
              <ul className="space-y-1">
                <li>1, 2, 3, 4, 5 = 500</li>
                <li>2, 3, 4, 5, 6 = 750</li>
                <li>1, 2, 3, 4, 5, 6 = 1500</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-amber-100">Three of a Kind</h4>
              <ul className="space-y-1">
                <li>Three 1s = 1000</li>
                <li>Three 2s = 200</li>
                <li>Three 3s = 300</li>
                <li>Three 4s = 400</li>
                <li>Three 5s = 500</li>
                <li>Three 6s = 600</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-amber-100">Special Combos</h4>
              <ul className="space-y-1">
                <li>Holy + 3 + 3 + 3 = 3000</li>
                <li>Devil + 6 + 6 + 6 = 3000</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-amber-100">Four, Five, and Six of a Kind</h4>
              <p className="mb-2 text-sm text-stone-300">
                Each additional matching die after three doubles the value.
              </p>
              <ul className="space-y-1">
                <li>2222 = 400</li>
                <li>22222 = 800</li>
                <li>222222 = 1600</li>
                <li>1111 = 2000</li>
                <li>11111 = 4000</li>
                <li>111111 = 8000</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={onBack} className="mt-6">
        Back
      </Button>
    </Panel>
  );
}
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
              <li>If you roll no scoring dice, you usually bust and lose all points from that turn.</li>
              <li>If all rolled dice score, you get hot dice and all six dice return for another roll in the same turn.</li>
              <li>You can bank your turn points instead of rolling again.</li>
              <li>The first player to reach the target score wins.</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 text-xl font-semibold text-amber-200">Special Dice Notes</h3>
            <ul className="space-y-2 text-stone-200">
              <li>Nika face only exists on Nika Dice when it rolls 1.</li>
              <li>Reversi face only exists on Reversi Dice when it rolls 1.</li>
              <li>Joker face only exists on Joker die when it rolls 1.</li>
              <li>Going Merry and Sunny can prevent certain busts.</li>
              <li>Lost Die can disappear and be rolled by your opponent next turn.</li>
              <li>Germa Die can be destroyed for the whole match if it busts on 66.</li>
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
                <li>Sunny alone as last die = 1000</li>
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
              <h4 className="mb-2 font-semibold text-amber-100">Special Combos</h4>
              <ul className="space-y-1">
                <li>Nika + anything selected = all selected dice become playable and +1000 bonus</li>
                <li>Reversi + 6 + 6 + 6 = 3000</li>
                <li>Sun + 1 = 500</li>
                <li>Scar + 4 = 700</li>
                <li>66 + 6 + 6 = 1200</li>
                <li>66 + 6 + 6 + 6 = 2400</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-semibold text-amber-100">Lucky Clover</h4>
              <ul className="space-y-1">
                <li>Clover face is Lucky Die face 4.</li>
                <li>Clover alone does not score.</li>
                <li>If Clover is used in a valid combo, that combo is multiplied by x4.</li>
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
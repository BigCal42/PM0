import { scenarioList, type ScenarioPreset } from '@/features/scenario/presets';
import { useScenarioStore } from '@/store/scenarioStore';

interface ScenarioSelectorProps {
  multipliers: {
    demand: number;
    supply: number;
    preset: ScenarioPreset;
  };
}

export function ScenarioSelector({ multipliers }: ScenarioSelectorProps) {
  const selected = useScenarioStore((state) => state.selected);
  const setScenario = useScenarioStore((state) => state.setScenario);
  const demandAdjustment = useScenarioStore((state) => state.demandAdjustment);
  const supplyAdjustment = useScenarioStore((state) => state.supplyAdjustment);
  const setDemandAdjustment = useScenarioStore((state) => state.setDemandAdjustment);
  const setSupplyAdjustment = useScenarioStore((state) => state.setSupplyAdjustment);

  return (
    <section className="grid gap-6 rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/5 ring-1 ring-slate-200">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-900">Scenario controls</h2>
        <p className="text-sm text-slate-600">Select a preset, then fine-tune demand and supply multipliers.</p>
      </header>

      <div className="flex flex-wrap gap-3">
        {scenarioList.map((scenario) => {
          const isActive = scenario.key === selected;
          return (
            <button
              key={scenario.key}
              onClick={() => setScenario(scenario.key)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-700 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
              type="button"
            >
              {scenario.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <MultiplierSlider
          id="demand-multiplier"
          label="Demand multiplier"
          value={demandAdjustment}
          onChange={setDemandAdjustment}
          baseline={multipliers.preset.multipliers.demand}
        />
        <MultiplierSlider
          id="supply-multiplier"
          label="Supply multiplier"
          value={supplyAdjustment}
          onChange={setSupplyAdjustment}
          baseline={multipliers.preset.multipliers.supply}
        />
      </div>
    </section>
  );
}

interface SliderProps {
  id: string;
  label: string;
  value: number;
  baseline: number;
  onChange: (value: number) => void;
}

function MultiplierSlider({ id, label, value, baseline, onChange }: SliderProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between text-sm font-medium text-slate-700">
        <span>{label}</span>
        <span className="font-semibold text-indigo-600">× {value.toFixed(2)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={0.6}
        max={1.4}
        step={0.02}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full rounded-full bg-slate-200 accent-indigo-500"
      />
      <p className="text-xs text-slate-500">Preset baseline × {baseline.toFixed(2)}</p>
    </label>
  );
}

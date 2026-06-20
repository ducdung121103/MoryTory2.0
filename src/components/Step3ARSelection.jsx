import { useDesign, useDesignDispatch } from '../store/DesignContext';
import { AR_EFFECTS } from '../data/arEffects';

export default function Step3ARSelection() {
  const { selectedAREffect } = useDesign();
  const dispatch = useDesignDispatch();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-ink">3. Chọn hiệu ứng AR</h3>
      
      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_AR_EFFECT', payload: null })}
          className={`p-4 rounded-xl text-left transition-all duration-300 ease-in-out border flex items-center justify-between ${
            selectedAREffect === null
              ? 'bg-walnut text-cream scale-[1.01] shadow-[var(--shadow-soft)] border-transparent' 
              : 'bg-card border border-line text-ink hover:border-walnut/50 hover:shadow-sm'
          }`}
        >
          <div>
            <div className="font-semibold">Không sử dụng</div>
            <div className={`text-sm mt-0.5 ${selectedAREffect === null ? 'text-cream/80' : 'text-ink-muted'}`}>
              Chỉ in khung ảnh truyền thống
            </div>
          </div>
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
            selectedAREffect === null ? 'bg-cream border-cream text-walnut' : 'border-line'
          }`}>
            {selectedAREffect === null && <div className="w-2.5 h-2.5 rounded-full bg-walnut" />}
          </div>
        </button>

        {AR_EFFECTS.map((effect) => {
          const isSelected = selectedAREffect === effect.id;
          return (
            <button
              key={effect.id}
              type="button"
              onClick={() => dispatch({ type: 'SET_AR_EFFECT', payload: effect.id })}
              className={`p-4 rounded-xl text-left transition-all duration-300 ease-in-out border flex items-center justify-between ${
                isSelected 
                  ? 'bg-walnut text-cream scale-[1.01] shadow-[var(--shadow-soft)] border-transparent' 
                  : 'bg-card border border-line text-ink hover:border-walnut/50 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="font-semibold">{effect.name}</div>
                <div className={`text-sm mt-0.5 ${isSelected ? 'text-cream/80' : 'text-ink-muted'}`}>
                  {effect.desc}
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                isSelected ? 'bg-cream border-cream text-walnut' : 'border-line'
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-walnut" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
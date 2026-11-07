import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Cpu, Gamepad, Keyboard, Music2, Sliders } from 'lucide-react';

import type { PlayerId } from '@/core/types';
import { useConfigStore } from '@/state/configStore';
import { useUIStore } from '@/state/uiStore';
import { ActionsTab } from '@/components/mappings/ActionsTab';
import { ControllerTab } from '@/components/mappings/ControllerTab';
import { ExpressionTab } from '@/components/mappings/ExpressionTab';
import { KeyboardTab } from '@/components/mappings/KeyboardTab';
import { NotesTab } from '@/components/mappings/NotesTab';
import { RemapWizardDialog } from '@/components/mappings/RemapWizardDialog';

void React;

export type MappingSubTab = 'notes' | 'expression' | 'controller' | 'actions' | 'keyboard';

interface MappingsScreenProps {
  player?: PlayerId;
}

export function MappingsScreen({ player }: MappingsScreenProps) {
  const [activeSubTab, setActiveSubTab] = useState<MappingSubTab>('notes');
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const activePlayer = useConfigStore((state) => state.settings.activePlayer);
  const targetPlayer = player ?? activePlayer;
  const playerConfig = useConfigStore((state) => state.players[targetPlayer]);

  const setActiveTab = useUIStore((state) => state.setActiveTab);

  return (
    <div
      className="
        flex flex-1 flex-col bg-bg p-4
        md:p-8
      "
      data-testid="mappings-screen"
    >
      <div className="mx-auto flex flex-col gap-6 inline-full max-inline-5xl">
        {/* Navigation Breadcrumb & Header */}
        <div
          className="
            flex items-center justify-between border-be border-line/60 pbe-4
          "
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('perform')}
              className="
                flex items-center gap-1.5 rounded-field border border-line/60
                bg-field px-3 py-1.5 text-xs font-semibold text-text
                transition-colors
                hover:border-line hover:bg-field-hover
              "
            >
              <ArrowLeft className="block-4 inline-4" />
              <span>Back to Studio</span>
            </button>
            <div className="flex items-center gap-1.5 font-mono text-xs text-muted">
              <span>Mappings</span>
              <ChevronRight className="block-3 inline-3" />
              <span className="font-bold text-accent">{playerConfig.name}</span>
            </div>
          </div>
        </div>

        {/* Sub-Tab Navigation Strip */}
        <div
          className="
            flex flex-wrap items-center gap-1.5 border-be border-line/40 pbe-2
          "
        >
          <button
            type="button"
            onClick={() => setActiveSubTab('notes')}
            className={`
              flex items-center gap-2 rounded-field border px-3 py-1.5 text-xs
              font-bold transition-all
              ${
                activeSubTab === 'notes'
                  ? 'border-accent bg-accent text-[#1f1f1f] shadow-sm'
                  : `
                    border-line/40 bg-field/60 text-muted
                    hover:border-line hover:text-text
                  `
              }
            `}
          >
            <Music2 className="block-3.5 inline-3.5" />
            <span>Notes & Scales</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('expression')}
            className={`
              flex items-center gap-2 rounded-field border px-3 py-1.5 text-xs
              font-bold transition-all
              ${
                activeSubTab === 'expression'
                  ? 'border-accent bg-accent text-[#1f1f1f] shadow-sm'
                  : `
                    border-line/40 bg-field/60 text-muted
                    hover:border-line hover:text-text
                  `
              }
            `}
          >
            <Sliders className="block-3.5 inline-3.5" />
            <span>Expression</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('controller')}
            className={`
              flex items-center gap-2 rounded-field border px-3 py-1.5 text-xs
              font-bold transition-all
              ${
                activeSubTab === 'controller'
                  ? 'border-accent bg-accent text-[#1f1f1f] shadow-sm'
                  : `
                    border-line/40 bg-field/60 text-muted
                    hover:border-line hover:text-text
                  `
              }
            `}
          >
            <Gamepad className="block-3.5 inline-3.5" />
            <span>Controller & Shaping</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('actions')}
            className={`
              flex items-center gap-2 rounded-field border px-3 py-1.5 text-xs
              font-bold transition-all
              ${
                activeSubTab === 'actions'
                  ? 'border-accent bg-accent text-[#1f1f1f] shadow-sm'
                  : `
                    border-line/40 bg-field/60 text-muted
                    hover:border-line hover:text-text
                  `
              }
            `}
          >
            <Cpu className="block-3.5 inline-3.5" />
            <span>Auxiliary Actions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('keyboard')}
            className={`
              flex items-center gap-2 rounded-field border px-3 py-1.5 text-xs
              font-bold transition-all
              ${
                activeSubTab === 'keyboard'
                  ? 'border-accent bg-accent text-[#1f1f1f] shadow-sm'
                  : `
                    border-line/40 bg-field/60 text-muted
                    hover:border-line hover:text-text
                  `
              }
            `}
          >
            <Keyboard className="block-3.5 inline-3.5" />
            <span>Keyboard Bindings</span>
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="pbs-2">
          {activeSubTab === 'notes' && <NotesTab player={targetPlayer} />}
          {activeSubTab === 'expression' && <ExpressionTab player={targetPlayer} />}
          {activeSubTab === 'controller' && (
            <ControllerTab player={targetPlayer} onOpenRemapWizard={() => setIsWizardOpen(true)} />
          )}
          {activeSubTab === 'actions' && <ActionsTab player={targetPlayer} />}
          {activeSubTab === 'keyboard' && <KeyboardTab />}
        </div>
      </div>

      {/* Remap Wizard Modal */}
      <RemapWizardDialog open={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
    </div>
  );
}

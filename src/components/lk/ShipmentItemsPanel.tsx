import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Paperclip,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { lkApi } from '@/api/lkClient';
import { useLKLanguage } from '@/contexts/LKLanguageContext';
import { lkT, LKDictKey } from '@/lib/lkTranslations';
import {
  OrganizationProfile,
  OrganizationProfileType,
  Shipment,
  ShipmentItem,
} from '@/types/lk';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AutoGrowTextarea } from '@/components/lk/AutoGrowTextarea';
import { ResizableTh } from '@/components/lk/ResizableTh';
import { useResizableColumns } from '@/hooks/useResizableColumns';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ShipmentFilesPanel } from '@/components/lk/ShipmentFilesPanel';
import { GenerateCertRequestModal } from '@/components/lk/GenerateCertRequestModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


interface Props {
  shipmentId: number;
  shipment: Shipment;
  items: ShipmentItem[];
  isManager: boolean;
}


const PRODUCT_FIELD_KEYS: Array<{
  key: keyof Omit<ShipmentItem, 'id' | 'shipment_id' | 'position_no'>;
  labelKey: LKDictKey;
  textarea?: boolean;
  rows?: number;
  tone: 'green' | 'yellow';
}> = [
    { key: 'product', labelKey: 'th_product', tone: 'green' },
    { key: 'tech_description', labelKey: 'th_tech_description', textarea: true, rows: 4, tone: 'green' },
    { key: 'model_article', labelKey: 'th_model_article', tone: 'green' },
    { key: 'trademark', labelKey: 'th_trademark', tone: 'green' },
    { key: 'tn_ved', labelKey: 'th_tn_ved', tone: 'green' },
    { key: 'contract_invoice', labelKey: 'th_contract_invoice', tone: 'green' },
    { key: 'quantity', labelKey: 'th_quantity', tone: 'green' },
    { key: 'price', labelKey: 'th_price', tone: 'green' },
    { key: 'tr_ts', labelKey: 'th_tr_ts', textarea: true, rows: 4, tone: 'yellow' },
    { key: 'cert_form', labelKey: 'th_cert_form', tone: 'yellow' },
    { key: 'cert_price', labelKey: 'th_cert_price', tone: 'yellow' },
    { key: 'comment', labelKey: 'th_comment', textarea: true, rows: 3, tone: 'yellow' },
  ];


const toneClass = (tone: 'green' | 'yellow') =>
  tone === 'green'
    ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900'
    : 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900';


const HIDDEN_COLUMNS_STORAGE_KEY = 'lk_shipment_items_hidden_columns';
const COLUMN_WIDTHS_STORAGE_KEY = 'lk_shipment_items_column_widths';


function loadHiddenColumns(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(HIDDEN_COLUMNS_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}


function saveHiddenColumns(cols: Set<string>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(HIDDEN_COLUMNS_STORAGE_KEY, JSON.stringify(Array.from(cols)));
}


export function ShipmentItemsPanel({ shipmentId, shipment, items, isManager }: Props) {
  const qc = useQueryClient();
  const { language } = useLKLanguage();

  const [requestValues, setRequestValues] = useState({
    applicant_org: shipment.applicant_org || '',
    applicant_address: shipment.applicant_address || '',
    applicant_head: shipment.applicant_head || '',
    applicant_position: shipment.applicant_position || '',
    applicant_email: shipment.applicant_email || '',
    manufacturer_org: shipment.manufacturer_org || '',
    manufacturer_address: shipment.manufacturer_address || '',
    manufacturer_country: shipment.manufacturer_country || '',
  });

  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(
    () => loadHiddenColumns()
  );
  const [savingAll, setSavingAll] = useState(false);
  const [checkedIds, setCheckedIds] = useState<Set<number>>(new Set());
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

  const { getWidth, startResize, resetWidths } = useResizableColumns(COLUMN_WIDTHS_STORAGE_KEY, 200);

  // ─────────────────────────────────────────────────────────────
  // Справочник сохранённых организаций — ВСТАВИТЬ ЭТОТ БЛОК
  // ─────────────────────────────────────────────────────────────
  const [applicantProfileId, setApplicantProfileId] = useState<string>('');
  const [manufacturerProfileId, setManufacturerProfileId] = useState<string>('');

  const [pendingProfile, setPendingProfile] = useState<{
    profileType: OrganizationProfileType;
    profile: OrganizationProfile;
    payload: {
      name: string;
      address: string;
      head: string;
      position: string;
      email: string;
      country: string;
    };
  } | null>(null);

  const applicantProfiles = useQuery({
    queryKey: [
      'lk',
      'organization-profiles',
      shipment.client_id,
      'applicant',
    ],
    queryFn: () =>
      lkApi.organizationProfiles(shipment.client_id, 'applicant'),
    enabled: !!shipment.client_id,
  });

  const manufacturerProfiles = useQuery({
    queryKey: [
      'lk',
      'organization-profiles',
      shipment.client_id,
      'manufacturer',
    ],
    queryFn: () =>
      lkApi.organizationProfiles(shipment.client_id, 'manufacturer'),
    enabled: !!shipment.client_id,
  });

  const saveAllFns = useRef<Record<number, () => Promise<void>>>({});

  const registerSaveAll = useCallback(
    (itemId: number, fn: () => Promise<void>) => {
      saveAllFns.current[itemId] = fn;
    },
    []
  );

  const unregisterSaveAll = useCallback((itemId: number) => {
    delete saveAllFns.current[itemId];
  }, []);


  const toggleColumn = (key: string) => {
    setHiddenColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      saveHiddenColumns(next);
      return next;
    });
  };


  const visibleFields = useMemo(
    () => PRODUCT_FIELD_KEYS.filter((f) => !hiddenColumns.has(f.key as string)),
    [hiddenColumns]
  );


  useEffect(() => {
    setRequestValues({
      applicant_org: shipment.applicant_org || '',
      applicant_address: shipment.applicant_address || '',
      applicant_head: shipment.applicant_head || '',
      applicant_position: shipment.applicant_position || '',
      applicant_email: shipment.applicant_email || '',
      manufacturer_org: shipment.manufacturer_org || '',
      manufacturer_address: shipment.manufacturer_address || '',
      manufacturer_country: shipment.manufacturer_country || '',
    });
  }, [shipment]);


  const invalidate = useCallback(() => {
    qc.invalidateQueries({ queryKey: ['lk', 'shipment', shipmentId] });
    qc.invalidateQueries({ queryKey: ['lk', 'shipment-items', shipmentId] });
    qc.invalidateQueries({ queryKey: ['lk', 'shipments'] });
  }, [qc, shipmentId]);

  const updateInfo = useMutation({
    mutationFn: (data: Partial<Shipment>) => lkApi.updateShipmentInfo(shipmentId, data),
    onSuccess: () => {
      toast.success('Данные поставки сохранены');
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось сохранить данные'),
  });

  const createProfile = useMutation({
    mutationFn: (data: {
      client_id: number;
      profile_type: OrganizationProfileType;
      name: string;
      address: string;
      head?: string;
      position?: string;
      email?: string;
      country?: string;
    }) => lkApi.createOrganizationProfile(data),
    onSuccess: (created) => {
      toast.success(lkT('toast_organization_created', language));

      qc.invalidateQueries({
        queryKey: [
          'lk',
          'organization-profiles',
          created.client_id,
          created.profile_type,
        ],
      });

      if (created.profile_type === 'applicant') {
        setApplicantProfileId(String(created.id));
      } else {
        setManufacturerProfileId(String(created.id));
      }

      setPendingProfile(null);
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось сохранить организацию'),
  });

  const updateProfile = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        name: string;
        address: string;
        head?: string;
        position?: string;
        email?: string;
        country?: string;
      };
    }) => lkApi.updateOrganizationProfile(id, data),
    onSuccess: (updated) => {
      toast.success(lkT('toast_organization_updated', language));

      qc.invalidateQueries({
        queryKey: [
          'lk',
          'organization-profiles',
          updated.client_id,
          updated.profile_type,
        ],
      });

      if (updated.profile_type === 'applicant') {
        setApplicantProfileId(String(updated.id));
      } else {
        setManufacturerProfileId(String(updated.id));
      }

      setPendingProfile(null);
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось обновить организацию'),
  });


  const addItem = useMutation({
    mutationFn: () => lkApi.addShipmentItem(shipmentId),
    onSuccess: () => {
      toast.success('Позиция добавлена');
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось добавить'),
  });


  const setRequestField = (key: keyof typeof requestValues, value: string) => {
    setRequestValues((prev) => ({ ...prev, [key]: value }));
  };

  const saveRequestBlock = (keys: (keyof typeof requestValues)[]) => {
    const diff: Partial<Shipment> = {};
    keys.forEach((key) => {
      if (requestValues[key] !== ((shipment as any)[key] || '')) {
        (diff as any)[key] = requestValues[key];
      }
    });
    if (Object.keys(diff).length === 0) {
      toast.info('Нет изменений');
      return;
    }
    updateInfo.mutate(diff);
  };

  const applyOrganizationProfile = (
    profileType: OrganizationProfileType,
    profileId: string
  ) => {
    const profiles =
      profileType === 'applicant'
        ? applicantProfiles.data ?? []
        : manufacturerProfiles.data ?? [];

    const profile = profiles.find((item) => item.id === Number(profileId));

    if (!profile) return;

    if (profileType === 'applicant') {
      setApplicantProfileId(profileId);

      setRequestValues((prev) => ({
        ...prev,
        applicant_org: profile.name,
        applicant_address: profile.address,
        applicant_head: profile.head,
        applicant_position: profile.position,
        applicant_email: profile.email,
      }));

      return;
    }

    setManufacturerProfileId(profileId);

    setRequestValues((prev) => ({
      ...prev,
      manufacturer_org: profile.name,
      manufacturer_address: profile.address,
      manufacturer_country: profile.country,
    }));
  };

  const getOrganizationPayload = (
    profileType: OrganizationProfileType
  ) => {
    if (profileType === 'applicant') {
      return {
        name: requestValues.applicant_org.trim(),
        address: requestValues.applicant_address.trim(),
        head: requestValues.applicant_head.trim(),
        position: requestValues.applicant_position.trim(),
        email: requestValues.applicant_email.trim(),
        country: '',
      };
    }

    return {
      name: requestValues.manufacturer_org.trim(),
      address: requestValues.manufacturer_address.trim(),
      head: '',
      position: '',
      email: '',
      country: requestValues.manufacturer_country.trim(),
    };
  };

  const saveAsOrganization = async (profileType: OrganizationProfileType) => {
    const payload = getOrganizationPayload(profileType);

    if (!payload.name) {
      toast.error(lkT('toast_select_organization', language));
      return;
    }

    try {
      const check = await lkApi.checkOrganizationProfile(
        shipment.client_id,
        profileType,
        payload.name
      );

      if (check.exists && check.profile) {
        setPendingProfile({
          profileType,
          profile: check.profile,
          payload,
        });
        return;
      }

      createProfile.mutate({
        client_id: shipment.client_id,
        profile_type: profileType,
        ...payload,
      });
    } catch (e: any) {
      toast.error(e?.message || 'Не удалось проверить организацию');
    }
  };


  const saveAllItems = async () => {
    const entries = Object.entries(saveAllFns.current);

    if (entries.length === 0) {
      toast.error(
        'Не удалось получить изменённые позиции для сохранения. Обновите страницу и повторите попытку.'
      );
      return;
    }

    setSavingAll(true);

    try {
      await Promise.all(entries.map(([, save]) => save()));
      toast.success('Изменения сохранены');
    } catch (e: any) {
      toast.error(e?.message || 'Не удалось сохранить изменения');
    } finally {
      setSavingAll(false);
    }
  };


  const toggleChecked = (itemId: number, checked: boolean) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(itemId);
      else next.delete(itemId);
      return next;
    });
  };


  const checkedItemIds = Array.from(checkedIds);


  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{lkT('section_applicant', language)}</h3>

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              saveRequestBlock([
                'applicant_org',
                'applicant_address',
                'applicant_head',
                'applicant_position',
                'applicant_email',
              ])
            }
            disabled={updateInfo.isPending}
          >
            <Save className="h-4 w-4 mr-1" />
            {lkT('btn_save_block', language)}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={applicantProfileId}
            onValueChange={(value) => applyOrganizationProfile('applicant', value)}
          >
            <SelectTrigger className="w-full sm:w-[320px]">
              <SelectValue
                placeholder={lkT('placeholder_select_organization', language)}
              />
            </SelectTrigger>

            <SelectContent>
              {applicantProfiles.data?.length ? (
                applicantProfiles.data.map((profile) => (
                  <SelectItem key={profile.id} value={String(profile.id)}>
                    {profile.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="__empty" disabled>
                  {lkT('empty_no_saved_organizations', language)}
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => saveAsOrganization('applicant')}
            disabled={createProfile.isPending || updateProfile.isPending}
          >
            {lkT('btn_save_as_organization', language)}
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>{lkT('field_org_name', language)}</Label>
            <Input
              value={requestValues.applicant_org}
              onChange={(e) => setRequestField('applicant_org', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>{lkT('field_legal_address', language)}</Label>
            <Input
              value={requestValues.applicant_address}
              onChange={(e) => setRequestField('applicant_address', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>{lkT('field_head', language)}</Label>
            <Input
              value={requestValues.applicant_head}
              onChange={(e) => setRequestField('applicant_head', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>{lkT('field_position', language)}</Label>
            <Input
              value={requestValues.applicant_position}
              onChange={(e) => setRequestField('applicant_position', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>{lkT('field_email', language)}</Label>
            <Input
              value={requestValues.applicant_email}
              onChange={(e) => setRequestField('applicant_email', e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            {lkT('section_manufacturer', language)}
          </h3>

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              saveRequestBlock([
                'manufacturer_org',
                'manufacturer_address',
                'manufacturer_country',
              ])
            }
            disabled={updateInfo.isPending}
          >
            <Save className="h-4 w-4 mr-1" />
            {lkT('btn_save_block', language)}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={manufacturerProfileId}
            onValueChange={(value) =>
              applyOrganizationProfile('manufacturer', value)
            }
          >
            <SelectTrigger className="w-full sm:w-[320px]">
              <SelectValue
                placeholder={lkT('placeholder_select_organization', language)}
              />
            </SelectTrigger>

            <SelectContent>
              {manufacturerProfiles.data?.length ? (
                manufacturerProfiles.data.map((profile) => (
                  <SelectItem key={profile.id} value={String(profile.id)}>
                    {profile.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="__empty" disabled>
                  {lkT('empty_no_saved_organizations', language)}
                </SelectItem>
              )}
            </SelectContent>
          </Select>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => saveAsOrganization('manufacturer')}
            disabled={createProfile.isPending || updateProfile.isPending}
          >
            {lkT('btn_save_as_organization', language)}
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>{lkT('field_org_name', language)}</Label>
            <Input
              value={requestValues.manufacturer_org}
              onChange={(e) => setRequestField('manufacturer_org', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>{lkT('field_address', language)}</Label>
            <Input
              value={requestValues.manufacturer_address}
              onChange={(e) =>
                setRequestField('manufacturer_address', e.target.value)
              }
            />
          </div>

          <div className="space-y-1">
            <Label>{lkT('field_country', language)}</Label>
            <Input
              value={requestValues.manufacturer_country}
              onChange={(e) =>
                setRequestField('manufacturer_country', e.target.value)
              }
            />
          </div>
        </div>
      </Card>


      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-semibold text-lg">{lkT('section_products', language)}</h3>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={resetWidths} title="Сбросить ширину колонок">
              Сбросить ширину
            </Button>
            <Button size="sm" variant="outline" onClick={saveAllItems} disabled={savingAll}>
              {savingAll ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />}
              {savingAll ? 'Сохранение…' : lkT('btn_save', language)}
            </Button>
            {isManager && (
              <Button
                size="sm"
                onClick={() => setGenerateModalOpen(true)}
                disabled={checkedItemIds.length === 0}
              >
                <FileText className="h-4 w-4 mr-1" />
                {lkT('btn_generate_cert_request', language)}
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => addItem.mutate()} disabled={addItem.isPending}>
              <Plus className="h-4 w-4 mr-1" />
              {addItem.isPending ? 'Добавление…' : lkT('btn_add_item', language)}
            </Button>
          </div>
        </div>


        <div className="hidden md:block border rounded-md overflow-auto max-h-[70vh]">
          <table className="text-sm border-collapse" style={{ tableLayout: 'fixed', width: 'max-content', minWidth: '100%' }}>
            <thead className="sticky top-0 z-10 bg-background shadow-sm">
              <tr>
                <th className="p-2 border-b text-center w-10">{lkT('th_check', language)}</th>
                <th className="p-2 border-b text-center w-10">{lkT('th_number', language)}</th>
                {visibleFields.map((f) => (
                  <ResizableTh
                    key={f.key as string}
                    width={getWidth(f.key as string)}
                    onResizeStart={(e) => startResize(f.key as string, e)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{lkT(f.labelKey, language)}</span>
                      <button
                        type="button"
                        title={lkT('btn_hide_column', language)}
                        onClick={() => toggleColumn(f.key as string)}
                        className="text-muted-foreground hover:text-foreground shrink-0"
                      >
                        <EyeOff className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </ResizableTh>
                ))}
                <th className="p-2 border-b text-center w-20">{lkT('th_actions', language)}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <ShipmentItemRow
                  key={item.id}
                  shipmentId={shipmentId}
                  item={item}
                  variant="row"
                  canDelete={items.length > 1}
                  isManager={isManager}
                  checked={checkedIds.has(item.id)}
                  onCheckedChange={(c) => toggleChecked(item.id, c)}
                  onInvalidate={invalidate}
                  visibleFields={visibleFields}
                  getWidth={getWidth}
                  registerSaveAll={registerSaveAll}
                  unregisterSaveAll={unregisterSaveAll}
                />
              ))}
            </tbody>
          </table>
        </div>


        {hiddenColumns.size > 0 && (
          <div className="hidden md:flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
            <span>{lkT('hidden_columns_label', language)}</span>
            {PRODUCT_FIELD_KEYS.filter((f) => hiddenColumns.has(f.key as string)).map((f) => (
              <button
                key={f.key as string}
                type="button"
                onClick={() => toggleColumn(f.key as string)}
                className="flex items-center gap-1 px-2 py-1 rounded border hover:bg-muted"
              >
                <Eye className="h-3 w-3" />
                {lkT(f.labelKey, language)}
              </button>
            ))}
          </div>
        )}


        <div className="md:hidden space-y-3">
          {items.map((item) => (
            <ShipmentItemRow
              key={item.id}
              shipmentId={shipmentId}
              item={item}
              variant="card"
              canDelete={items.length > 1}
              isManager={isManager}
              checked={checkedIds.has(item.id)}
              onCheckedChange={(c) => toggleChecked(item.id, c)}
              onInvalidate={invalidate}
              visibleFields={visibleFields}
              getWidth={getWidth}
              registerSaveAll={registerSaveAll}
              unregisterSaveAll={unregisterSaveAll}
            />
          ))}
        </div>


        <p className="text-xs text-muted-foreground">{lkT('footer_note_checked_items', language)}</p>
      </div>


      {generateModalOpen && (
        <GenerateCertRequestModal
          shipmentId={shipmentId}
          itemIds={checkedItemIds}
          onClose={() => setGenerateModalOpen(false)}
          onSuccess={() => {
            setGenerateModalOpen(false);
            setCheckedIds(new Set());
            invalidate();
          }}
        />
      )}

      <AlertDialog
        open={pendingProfile !== null}
        onOpenChange={(open) => {
          if (!open) setPendingProfile(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {lkT('dialog_organization_exists_title', language)}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lkT('dialog_organization_exists_desc', language)}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              {lkT('btn_cancel', language)}
            </AlertDialogCancel>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (!pendingProfile) return;

                createProfile.mutate({
                  client_id: shipment.client_id,
                  profile_type: pendingProfile.profileType,
                  ...pendingProfile.payload,
                });
              }}
              disabled={createProfile.isPending || updateProfile.isPending}
            >
              {lkT('btn_create_duplicate', language)}
            </Button>

            <Button
              type="button"
              onClick={() => {
                if (!pendingProfile) return;

                updateProfile.mutate({
                  id: pendingProfile.profile.id,
                  data: pendingProfile.payload,
                });
              }}
              disabled={createProfile.isPending || updateProfile.isPending}
            >
              {lkT('btn_update_existing', language)}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


interface RowProps {
  shipmentId: number;
  item: ShipmentItem;
  variant: 'row' | 'card';
  canDelete: boolean;
  isManager: boolean;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onInvalidate: () => void;
  visibleFields: typeof PRODUCT_FIELD_KEYS;
  getWidth: (key: string) => number;
  registerSaveAll: (itemId: number, fn: () => Promise<void>) => void;
  unregisterSaveAll: (itemId: number) => void;
}


function ShipmentItemRow({
  shipmentId,
  item,
  variant,
  canDelete,
  isManager,
  checked,
  onCheckedChange,
  onInvalidate,
  visibleFields,
  getWidth,
  registerSaveAll,
  unregisterSaveAll,
}: RowProps) {
  const { language } = useLKLanguage();
  const [values, setValues] = useState(item);
  const [filesOpen, setFilesOpen] = useState(false);


  useEffect(() => {
    setValues(item);
  }, [item]);


  const update = useMutation({
    mutationFn: (data: Partial<ShipmentItem>) => lkApi.updateShipmentItem(shipmentId, item.id, data),
    onSuccess: () => onInvalidate(),
    onError: (e: any) => toast.error(e?.message || 'Не удалось сохранить'),
  });


  const remove = useMutation({
    mutationFn: () => lkApi.deleteShipmentItem(shipmentId, item.id),
    onSuccess: () => {
      toast.success('Позиция удалена');
      onInvalidate();
    },
    onError: (e: any) => toast.error(e?.message || 'Не удалось удалить'),
  });


  const generateSingleDoc = useMutation({
    mutationFn: () => lkApi.generateCertRequestDoc(shipmentId, [item.id]),
    onError: (e: any) => toast.error(e?.message || 'Не удалось сформировать заявку'),
  });


  const setField = (key: keyof ShipmentItem, v: string) => setValues((prev) => ({ ...prev, [key]: v }));


  const saveIfChanged = (key: keyof ShipmentItem) => {
    if ((values as any)[key] !== (item as any)[key]) {
      update.mutate({ [key]: (values as any)[key] } as Partial<ShipmentItem>);
    }
  };


  useEffect(() => {
    registerSaveAll(item.id, async () => {
      const diff: Partial<ShipmentItem> = {};
      const keys: (keyof ShipmentItem)[] = visibleFields.map((f) => f.key as keyof ShipmentItem);
      for (const key of keys) {
        if ((values as any)[key] !== (item as any)[key]) {
          (diff as any)[key] = (values as any)[key];
        }
      }
      if (Object.keys(diff).length === 0) return;
      await lkApi.updateShipmentItem(shipmentId, item.id, diff);
      onInvalidate();
    });
    return () => unregisterSaveAll(item.id);
  }, [values, item, visibleFields, shipmentId, registerSaveAll, unregisterSaveAll, onInvalidate]);


  const deleteBtn = canDelete ? (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost" title={lkT('btn_delete', language)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{lkT('dialog_delete_position_title', language)}{item.position_no}?</AlertDialogTitle>
          <AlertDialogDescription>{lkT('dialog_delete_position_desc', language)}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{lkT('btn_cancel', language)}</AlertDialogCancel>
          <AlertDialogAction onClick={() => remove.mutate()}>{lkT('btn_delete', language)}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;


  const busy = update.isPending;


  if (variant === 'row') {
    return (
      <>
        <tr className="border-b align-top">
          <td className="p-2 text-center">
            <Checkbox checked={checked} onCheckedChange={(c) => onCheckedChange(!!c)} />
          </td>
          <td className="p-2 text-center">
            {item.position_no}
            {busy && <Loader2 className="h-3 w-3 animate-spin inline ml-1" />}
          </td>
          {visibleFields.map((f) => (
            <td
              key={f.key as string}
              className="p-2"
              style={{ width: getWidth(f.key as string), minWidth: getWidth(f.key as string), maxWidth: getWidth(f.key as string) }}
            >
              {f.textarea ? (
                <AutoGrowTextarea
                  rows={f.rows || 3}
                  value={(values as any)[f.key] || ''}
                  onChange={(e) => setField(f.key as keyof ShipmentItem, e.target.value)}
                  onBlur={() => saveIfChanged(f.key as keyof ShipmentItem)}
                  className={`w-full ${toneClass(f.tone)}`}
                />
              ) : (
                <Input
                  value={(values as any)[f.key] || ''}
                  onChange={(e) => setField(f.key as keyof ShipmentItem, e.target.value)}
                  onBlur={() => saveIfChanged(f.key as keyof ShipmentItem)}
                  className={toneClass(f.tone)}
                />
              )}
            </td>
          ))}
          <td className="p-2">
            <div className="flex items-center justify-center gap-1">
              {isManager && (
                <Button
                  size="icon"
                  variant="ghost"
                  title={lkT('btn_generate_single', language)}
                  onClick={() => generateSingleDoc.mutate()}
                  disabled={generateSingleDoc.isPending}
                >
                  {generateSingleDoc.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                </Button>
              )}
              {deleteBtn}
            </div>
          </td>
        </tr>
        <tr className="border-b">
          <td colSpan={3 + visibleFields.length} className="p-2">
            <Button size="sm" variant="ghost" onClick={() => setFilesOpen((v) => !v)} className="w-full justify-center">
              {filesOpen ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
              <Paperclip className="h-4 w-4 mr-1" />
              {filesOpen ? lkT('btn_hide_attachments', language) : lkT('btn_show_attachments', language)}{' '}
              {lkT('label_attachments_for_position', language)}{item.position_no}
            </Button>
            {filesOpen && (
              <div className="mt-2">
                <ShipmentFilesPanel shipmentId={shipmentId} itemId={item.id} />
              </div>
            )}
          </td>
        </tr>
      </>
    );
  }


  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox checked={checked} onCheckedChange={(c) => onCheckedChange(!!c)} />
          <span className="font-medium">{lkT('position_label', language)}{item.position_no}</span>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
        <div className="flex items-center gap-1">{deleteBtn}</div>
      </div>


      {visibleFields.map((f) => (
        <div key={f.key as string} className="space-y-1">
          <Label className="text-xs text-muted-foreground">{lkT(f.labelKey, language)}</Label>
          {f.textarea ? (
            <AutoGrowTextarea
              rows={f.rows || 3}
              value={(values as any)[f.key] || ''}
              onChange={(e) => setField(f.key as keyof ShipmentItem, e.target.value)}
              onBlur={() => saveIfChanged(f.key as keyof ShipmentItem)}
              className={toneClass(f.tone)}
            />
          ) : (
            <Input
              value={(values as any)[f.key] || ''}
              onChange={(e) => setField(f.key as keyof ShipmentItem, e.target.value)}
              onBlur={() => saveIfChanged(f.key as keyof ShipmentItem)}
              className={toneClass(f.tone)}
            />
          )}
        </div>
      ))}


      <Button size="sm" variant="ghost" onClick={() => setFilesOpen((v) => !v)} className="w-full justify-start">
        {filesOpen ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
        <Paperclip className="h-4 w-4 mr-1" />
        {lkT('label_attachments_for_position', language)}{item.position_no}
      </Button>
      {filesOpen && (
        <div className="mt-2">
          <ShipmentFilesPanel shipmentId={shipmentId} itemId={item.id} />
        </div>
      )}
    </Card>
  );
}
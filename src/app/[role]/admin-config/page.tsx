
'use client';

import React, { useState } from 'react';
import { useFeatures, type FeatureModule } from '@/hooks/use-features';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcw, Save, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminFeatureConfigPage() {
  const { features, toggleFeature, resetFeatures } = useFeatures();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const categories = [...new Set(features.map((m) => m.category))];

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Configuration Saved",
        description: "Feature modules have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Admin Feature Config</h1>
          <p className="text-muted-foreground">Enable or disable modules for your organization.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={resetFeatures} title="Reset to defaults">
                <RotateCcw className="w-4 h-4 mr-2"/> Reset
            </Button>
            <Button onClick={handleSave} disabled={loading}>
                <Save className="w-4 h-4 mr-2"/> {loading ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{features.length}</div>
            <p className="text-xs text-muted-foreground">Total Modules</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {features.filter((m) => m.enabled).length}
            </div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-muted-foreground">
              {features.filter((m) => !m.enabled).length}
            </div>
            <p className="text-xs text-muted-foreground">Inactive</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary"/> {category} Modules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features
                .filter((f) => f.category === category)
                .map((feature) => (
                  <Card key={feature.id} className={`transition-all ${feature.enabled ? 'border-primary/50 bg-primary/5' : 'opacity-70'}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base font-medium">{feature.label}</CardTitle>
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={() => toggleFeature(feature.id)}
                        />
                      </div>
                      <CardDescription className="text-xs">{feature.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Badge variant={feature.enabled ? "default" : "outline"}>
                            {feature.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
